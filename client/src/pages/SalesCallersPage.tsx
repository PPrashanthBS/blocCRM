import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Plus, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatCard } from '@/components/common/StatCard';
import {
  createSalesCaller,
  deleteSalesCaller,
  getSalesCallers,
  updateSalesCaller,
} from '@/services/salesCallersService';
import type { SalesCaller } from '@/lib/types';

const emptyForm = {
  name: '',
  role: '',
  languages: '',
  dailyLeadLimit: 15,
  assignedStates: '',
};

export const SalesCallersPage = () => {
  const queryClient = useQueryClient();

  // Add dialog
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState({ ...emptyForm });

  // Edit dialog
  const [editingCaller, setEditingCaller] = useState<SalesCaller | null>(null);
  const [editForm, setEditForm] = useState({ ...emptyForm });

  const callersQuery = useQuery({
    queryKey: ['salesCallers'],
    queryFn: getSalesCallers,
  });

  const createMutation = useMutation({
    mutationFn: createSalesCaller,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesCallers'] });
      setIsAddOpen(false);
      setAddForm({ ...emptyForm });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: Record<string, unknown>;
    }) => updateSalesCaller(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesCallers'] });
      setEditingCaller(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteSalesCaller(id),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ['salesCallers'] }),
  });

  const callers = callersQuery.data?.data ?? [];

  const stats = useMemo(() => {
    const total = callers.length;
    const totalCapacity = callers.reduce(
      (sum, caller) => sum + caller.dailyLeadLimit,
      0,
    );
    return { total, totalCapacity };
  }, [callers]);

  /* ---------- handlers ---------- */

  const handleCreate = () => {
    createMutation.mutate({
      name: addForm.name,
      role: addForm.role,
      languages: addForm.languages
        .split(',')
        .map((l) => l.trim())
        .filter(Boolean),
      dailyLeadLimit: Number(addForm.dailyLeadLimit),
      assignedStates: addForm.assignedStates
        ? addForm.assignedStates
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean)
        : undefined,
    });
  };

  const openEdit = (caller: SalesCaller) => {
    setEditingCaller(caller);
    setEditForm({
      name: caller.name,
      role: caller.role,
      languages: caller.languages.join(', '),
      dailyLeadLimit: caller.dailyLeadLimit,
      assignedStates: caller.assignedStates?.join(', ') ?? '',
    });
  };

  const handleUpdate = () => {
    if (!editingCaller) return;
    updateMutation.mutate({
      id: editingCaller._id,
      payload: {
        name: editForm.name.trim(),
        role: editForm.role.trim(),
        languages: editForm.languages
          .split(',')
          .map((l) => l.trim())
          .filter(Boolean),
        dailyLeadLimit: Number(editForm.dailyLeadLimit),
        assignedStates: editForm.assignedStates
          ? editForm.assignedStates
              .split(',')
              .map((s) => s.trim())
              .filter(Boolean)
          : [],
      },
    });
  };

  /* ---------- reusable form fields ---------- */

  const renderFormFields = (
    form: typeof emptyForm,
    setForm: React.Dispatch<React.SetStateAction<typeof emptyForm>>,
  ) => (
    <div className="grid gap-4 py-2">
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Name
        </label>
        <Input
          value={form.name}
          onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Role
        </label>
        <Input
          value={form.role}
          onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))}
        />
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Languages
        </label>
        <Input
          placeholder="Hindi, English, Kannada"
          value={form.languages}
          onChange={(e) =>
            setForm((p) => ({ ...p, languages: e.target.value }))
          }
        />
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Daily Lead Limit
        </label>
        <Input
          type="number"
          min={1}
          value={form.dailyLeadLimit}
          onChange={(e) =>
            setForm((p) => ({
              ...p,
              dailyLeadLimit: Number(e.target.value),
            }))
          }
        />
      </div>
      <div className="grid gap-2">
        <label className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Assigned States
        </label>
        <Input
          placeholder="Maharashtra, Karnataka"
          value={form.assignedStates}
          onChange={(e) =>
            setForm((p) => ({ ...p, assignedStates: e.target.value }))
          }
        />
      </div>
    </div>
  );

  /* ---------- render ---------- */

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <StatCard
          label="Sales Callers"
          value={stats.total.toString()}
          icon={Users}
        />
        <StatCard
          label="Daily Capacity"
          value={stats.totalCapacity.toString()}
          helper="Total leads per day"
          icon={Users}
          tone="positive"
        />
      </div>

      <Card className="border-slate-200/70 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Caller Directory
            </h2>
            <p className="text-sm text-slate-500">
              Manage daily limits and regional coverage.
            </p>
          </div>

          {/* ---- Add dialog ---- */}
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Add Sales Caller
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px]">
              <DialogHeader>
                <DialogTitle>Add a new sales caller</DialogTitle>
              </DialogHeader>
              {renderFormFields(addForm, setAddForm)}
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAddOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreate}
                  disabled={createMutation.isPending}
                >
                  {createMutation.isPending ? 'Saving...' : 'Create'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* ---- Table ---- */}
        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Languages</TableHead>
                <TableHead>Daily Limit</TableHead>
                <TableHead>Assigned States</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {callersQuery.isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-slate-500"
                  >
                    Loading sales callers...
                  </TableCell>
                </TableRow>
              )}

              {callersQuery.isError && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="py-10 text-center text-sm text-rose-500"
                  >
                    {callersQuery.error instanceof Error
                      ? callersQuery.error.message
                      : 'Unable to load sales callers'}
                  </TableCell>
                </TableRow>
              )}

              {!callersQuery.isLoading &&
                !callersQuery.isError &&
                callers.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-10 text-center text-sm text-slate-500"
                    >
                      No sales callers added yet.
                    </TableCell>
                  </TableRow>
                )}

              {callers.map((caller) => (
                <TableRow key={caller._id}>
                  <TableCell className="font-medium text-slate-900">
                    {caller.name}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {caller.role}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {caller.languages.join(', ')}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {caller.dailyLeadLimit}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {caller.assignedStates?.length
                      ? caller.assignedStates.join(', ')
                      : 'All'}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {/* Edit button */}
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => openEdit(caller)}
                      >
                        <Pencil className="h-4 w-4 text-slate-500" />
                      </Button>

                      {/* Delete with confirmation */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4 text-rose-500" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete Sales Caller
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete{' '}
                              <span className="font-semibold">
                                {caller.name}
                              </span>
                              ? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              className="bg-rose-600 text-white hover:bg-rose-700"
                              onClick={() =>
                                deleteMutation.mutate(caller._id)
                              }
                            >
                              {deleteMutation.isPending
                                ? 'Deleting...'
                                : 'Delete'}
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* ---- Edit dialog ---- */}
      <Dialog
        open={editingCaller !== null}
        onOpenChange={(open) => {
          if (!open) setEditingCaller(null);
        }}
      >
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>Edit Sales Caller</DialogTitle>
          </DialogHeader>
          {renderFormFields(editForm, setEditForm)}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingCaller(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleUpdate}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
