import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Calendar, Filter, RefreshCw, Signal, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { deleteLead, getLeads } from '@/services/leadsService';

const statusOptions = ['all', 'new', 'contacted', 'qualified', 'lost'];
const sourceOptions = ['all', 'Instagram Ads', 'Google Search', 'Website Form', 'Referral', 'LinkedIn'];

export const LeadsPage = () => {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [source, setSource] = useState('all');
  const [sortValue, setSortValue] = useState('createdAt-desc');
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const [sortBy, sortOrder] = sortValue.split('-');
  const queryClient = useQueryClient();

  const deleteLeadMutation = useMutation({
    mutationFn: (id: string) => deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['leads'] });
      setDeleteTarget(null);
    },
  });

  const query = useQuery({
    queryKey: ['leads', { search, status, source, sortBy, sortOrder, page, limit }],
    queryFn: () =>
      getLeads({
        search: search || undefined,
        status: status === 'all' ? undefined : status,
        source: source === 'all' ? undefined : source,
        sortBy,
        sortOrder: sortOrder === 'asc' ? 'asc' : 'desc',
        page,
        limit,
      }),
  });

  const leads = query.data?.data ?? [];
  const totalPages = query.data?.totalPages ?? 1;

  const stats = useMemo(() => {
    const total = query.data?.total || 0;
    const qualified = leads.filter((lead) => lead.status === 'qualified').length;
    const newLeads = leads.filter((lead) => lead.status === 'new').length;
    return { total, qualified, newLeads };
  }, [leads, query.data]);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-3">
        <StatCard
          label="Total Leads"
          value={stats.total.toString()}
          helper="Across active sources"
          icon={Users}
        />
        <StatCard
          label="New This Week"
          value={stats.newLeads.toString()}
          helper="Latest inbound pipeline"
          icon={Signal}
          tone="positive"
        />
        <StatCard
          label="Qualified"
          value={stats.qualified.toString()}
          helper="Ready for sales"
          icon={Calendar}
          tone="warning"
        />
      </div>

      <Card className="border-slate-200/70 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-wrap items-center gap-3">
            <div className="min-w-[220px] flex-1">
              <Input
                placeholder="Search by name, email, or phone"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
              />
            </div>

            <Select
              value={status}
              onValueChange={(value) => {
                setStatus(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === 'all' ? 'All Statuses' : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={source}
              onValueChange={(value) => {
                setSource(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Source" />
              </SelectTrigger>
              <SelectContent>
                {sourceOptions.map((option) => (
                  <SelectItem key={option} value={option}>
                    {option === 'all' ? 'All Sources' : option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={sortValue}
              onValueChange={(value) => {
                setSortValue(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest first</SelectItem>
                <SelectItem value="createdAt-asc">Oldest first</SelectItem>
                <SelectItem value="fullName-asc">Name A-Z</SelectItem>
                <SelectItem value="fullName-desc">Name Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2" onClick={() => query.refetch()}>
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
            <Button variant="secondary" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Lead</TableHead>
                <TableHead>Source</TableHead>
                <TableHead>City</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="w-[60px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {query.isLoading && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-500">
                    Loading leads...
                  </TableCell>
                </TableRow>
              )}

              {query.isError && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-rose-500">
                    {query.error instanceof Error ? query.error.message : 'Unable to load leads'}
                  </TableCell>
                </TableRow>
              )}

              {!query.isLoading && !query.isError && leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="py-10 text-center text-sm text-slate-500">
                    No leads match the current filters.
                  </TableCell>
                </TableRow>
              )}

              {leads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>
                    <div className="text-sm font-medium text-slate-900">{lead.fullName}</div>
                    <div className="text-xs text-slate-500">{lead.phone}</div>
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">{lead.source}</TableCell>
                  <TableCell className="text-sm text-slate-600">{lead.city || '—'}</TableCell>
                  <TableCell className="text-sm text-slate-600">{lead.state || '—'}</TableCell>
                  <TableCell className="max-w-[200px] truncate text-sm text-slate-500" title={lead.notes || ''}>
                    {lead.notes || '—'}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-slate-400 hover:text-rose-600"
                      onClick={() => setDeleteTarget({ id: lead._id, name: lead.fullName })}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="mt-6 flex flex-col items-center justify-between gap-3 text-sm text-slate-500 sm:flex-row">
          <div>
            Page {page} of {totalPages}
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={String(limit)}
              onValueChange={(value) => {
                setLimit(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Rows" />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 30, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} rows
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" disabled={page === 1} onClick={() => setPage((prev) => prev - 1)}>
              Previous
            </Button>
            <Button
              variant="outline"
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Lead</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{deleteTarget?.name}</strong>? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLeadMutation.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-rose-600 hover:bg-rose-700"
              disabled={deleteLeadMutation.isPending}
              onClick={() => deleteTarget && deleteLeadMutation.mutate(deleteTarget.id)}
            >
              {deleteLeadMutation.isPending ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
