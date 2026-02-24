import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  ArrowRightLeft,
  ChevronLeft,
  ChevronRight,
  Play,
  RotateCcw,
  Shuffle,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { StatCard } from '@/components/common/StatCard';
import {
  getAssignmentStats,
  runAssignment,
  getAssignmentHistory,
  resetAssignments,
} from '@/services/assignmentService';
import type {
  AssignmentResultItem,
  RunAssignmentResponse,
} from '@/services/assignmentService';

export const LeadAssignmentPage = () => {
  const queryClient = useQueryClient();
  const [historyPage, setHistoryPage] = useState(1);
  const [lastRun, setLastRun] = useState<RunAssignmentResponse | null>(null);

  const statsQuery = useQuery({
    queryKey: ['assignmentStats'],
    queryFn: getAssignmentStats,
  });

  const historyQuery = useQuery({
    queryKey: ['assignmentHistory', historyPage],
    queryFn: () => getAssignmentHistory(historyPage, 10),
  });

  const runMutation = useMutation({
    mutationFn: runAssignment,
    onSuccess: (data) => {
      setLastRun(data);
      queryClient.invalidateQueries({ queryKey: ['assignmentStats'] });
      queryClient.invalidateQueries({ queryKey: ['assignmentHistory'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const resetMutation = useMutation({
    mutationFn: resetAssignments,
    onSuccess: () => {
      setLastRun(null);
      queryClient.invalidateQueries({ queryKey: ['assignmentStats'] });
      queryClient.invalidateQueries({ queryKey: ['assignmentHistory'] });
      queryClient.invalidateQueries({ queryKey: ['leads'] });
    },
  });

  const stats = statsQuery.data;
  const history = historyQuery.data;

  const matchBadge = (type: AssignmentResultItem['matchType']) => {
    if (type === 'state')
      return (
        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
          State Match
        </span>
      );
    if (type === 'global')
      return (
        <span className="inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
          Global RR
        </span>
      );
    return (
      <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
        Skipped
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Total Assigned"
          value={String(stats?.totalAssignments ?? '—')}
          icon={ArrowRightLeft}
        />
        <StatCard
          label="Assigned Today"
          value={String(stats?.assignedToday ?? '—')}
          icon={Zap}
          tone="positive"
        />
        <StatCard
          label="Total Capacity"
          value={String(stats?.totalCapacity ?? '—')}
          icon={Users}
        />
        <StatCard
          label="Remaining Today"
          value={String(stats?.remainingCapacity ?? '—')}
          icon={TrendingUp}
          tone="positive"
        />
      </div>

      {/* Action Panel */}
      <Card className="border-slate-200/70 bg-white/80 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Assignment Engine
            </h2>
            <p className="text-sm text-slate-500">
              Run the Round Robin engine to auto-assign unassigned leads to
              sales callers based on state mapping and daily limits.
            </p>
          </div>
          <div className="flex gap-2">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Reset All Assignments</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will remove all assignment records and unlink callers
                    from leads. You can re-run the engine afterwards.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-rose-600 text-white hover:bg-rose-700"
                    onClick={() => resetMutation.mutate()}
                  >
                    Reset
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>

            <Button
              className="gap-2"
              onClick={() => runMutation.mutate()}
              disabled={runMutation.isPending}
            >
              {runMutation.isPending ? (
                <>
                  <Shuffle className="h-4 w-4 animate-spin" />
                  Running...
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  Run Assignment
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Last Run Results */}
        {lastRun && (
          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-800">
              {lastRun.message}
            </p>
            {lastRun.results.length > 0 && (
              <div className="mt-3 overflow-hidden rounded-lg border border-slate-200">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-white">
                      <TableHead>Lead</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Assigned To</TableHead>
                      <TableHead>Match</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {lastRun.results.map((r) => (
                      <TableRow key={r.leadId}>
                        <TableCell className="font-medium text-slate-900">
                          {r.leadName}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {r.state || '—'}
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                          {r.callerName || r.reason || '—'}
                        </TableCell>
                        <TableCell>{matchBadge(r.matchType)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Caller Capacity Table */}
      {stats && stats.callers.length > 0 && (
        <Card className="border-slate-200/70 bg-white/80 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">
            Caller Capacity
          </h2>
          <p className="mb-4 text-sm text-slate-500">
            Daily assignment usage per sales caller.
          </p>
          <div className="overflow-hidden rounded-xl border border-slate-200">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50">
                  <TableHead>Caller</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Assigned States</TableHead>
                  <TableHead className="text-center">Today</TableHead>
                  <TableHead className="text-center">Limit</TableHead>
                  <TableHead>Usage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stats.callers.map((c) => {
                  const pct =
                    c.dailyLeadLimit > 0
                      ? Math.round(
                          (c.assignedToday / c.dailyLeadLimit) * 100,
                        )
                      : 0;
                  return (
                    <TableRow key={c._id}>
                      <TableCell className="font-medium text-slate-900">
                        {c.name}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {c.role}
                      </TableCell>
                      <TableCell className="text-sm text-slate-600">
                        {c.assignedStates.length
                          ? c.assignedStates.join(', ')
                          : 'All'}
                      </TableCell>
                      <TableCell className="text-center text-sm font-medium">
                        {c.assignedToday}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {c.dailyLeadLimit}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-200">
                            <div
                              className={`h-full rounded-full transition-all ${
                                pct >= 100
                                  ? 'bg-rose-500'
                                  : pct >= 75
                                    ? 'bg-amber-500'
                                    : 'bg-emerald-500'
                              }`}
                              style={{ width: `${Math.min(pct, 100)}%` }}
                            />
                          </div>
                          <span className="text-xs text-slate-500">
                            {pct}%
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Assignment History */}
      <Card className="border-slate-200/70 bg-white/80 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">
          Assignment History
        </h2>
        <p className="mb-4 text-sm text-slate-500">
          Recent lead-to-caller assignments.
        </p>

        <div className="overflow-hidden rounded-xl border border-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50">
                <TableHead>Lead</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Assigned To</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {historyQuery.isLoading && (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-10 text-center text-sm text-slate-500"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              )}

              {!historyQuery.isLoading &&
                (!history || history.data.length === 0) && (
                  <TableRow>
                    <TableCell
                      colSpan={4}
                      className="py-10 text-center text-sm text-slate-500"
                    >
                      No assignments yet. Click &quot;Run Assignment&quot; to
                      start.
                    </TableCell>
                  </TableRow>
                )}

              {history?.data.map((rec) => (
                <TableRow key={rec._id}>
                  <TableCell className="font-medium text-slate-900">
                    {rec.leadId?.Name ||
                      rec.leadId?.fullName ||
                      'Unknown'}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {rec.leadId?.State || '—'}
                  </TableCell>
                  <TableCell className="text-sm text-slate-600">
                    {rec.callerId?.name || '—'}
                  </TableCell>
                  <TableCell className="text-sm text-slate-500">
                    {new Date(rec.assignedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {history && history.totalPages > 1 && (
          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Page {history.page} of {history.totalPages} ({history.total}{' '}
              records)
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={historyPage <= 1}
                onClick={() => setHistoryPage((p) => p - 1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={historyPage >= history.totalPages}
                onClick={() => setHistoryPage((p) => p + 1)}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};
