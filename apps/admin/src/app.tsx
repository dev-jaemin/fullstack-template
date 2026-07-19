import { useState } from 'react';
import { useOrders, useUpdateOrderStatus } from '@repo/order/client';
import type { Order, OrderStatus } from '@repo/order/contract';
import {
  AppShell,
  Button,
  EmptyState,
  ErrorState,
  LoadingState,
  PageHeader,
  SectionHeader,
  Spinner,
  StatusBadge,
  Toast,
} from '@repo/ui';

const numberFormat = new Intl.NumberFormat('ko-KR');
const dateFormat = new Intl.DateTimeFormat('ko-KR', {
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
});

function OrderDetail({ order, onClose }: { order: Order; onClose: () => void }) {
  return (
    <aside className="rounded-lg border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">order detail</p>
          <h2 className="mt-1 text-lg font-black">{order.productName}</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="상세 닫기"
          className="text-xl text-muted-foreground"
        >
          ×
        </button>
      </div>
      <dl className="mt-6 divide-y divide-border text-sm">
        <div className="flex justify-between py-3">
          <dt className="text-muted-foreground">예약자</dt>
          <dd className="font-semibold">{order.guestName}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-muted-foreground">객실</dt>
          <dd className="font-semibold">{order.roomName}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-muted-foreground">일정</dt>
          <dd className="font-semibold">
            {order.nights}박 · {order.guestCount}명
          </dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-muted-foreground">결제 예정</dt>
          <dd className="font-semibold tabular-nums">₩{numberFormat.format(order.totalPrice)}</dd>
        </div>
        <div className="flex justify-between py-3">
          <dt className="text-muted-foreground">접수</dt>
          <dd className="font-semibold">{dateFormat.format(new Date(order.createdAt))}</dd>
        </div>
      </dl>
    </aside>
  );
}

export function App() {
  const [status, setStatus] = useState<OrderStatus | ''>('pending');
  const [selectedOrder, setSelectedOrder] = useState<Order>();
  const [toast, setToast] = useState('');
  const ordersQuery = useOrders(status ? { status } : {});
  const updateMutation = useUpdateOrderStatus();
  const updateStatus = async (order: Order, nextStatus: 'confirmed' | 'cancelled') => {
    await updateMutation.mutateAsync({ id: order.id, input: { status: nextStatus } });
    setToast(nextStatus === 'confirmed' ? '예약을 확정했습니다.' : '예약을 취소했습니다.');
    window.setTimeout(() => setToast(''), 3000);
  };
  const orders = ordersQuery.data?.data ?? [];
  return (
    <AppShell
      brand="stayline / ops"
      navigation={
        <nav className="flex items-center gap-4 text-sm">
          <span className="rounded-full bg-primary/10 px-3 py-1 font-bold text-primary">
            운영 모드
          </span>
          <a className="text-muted-foreground" href="http://localhost:5173">
            고객 화면 보기
          </a>
        </nav>
      }
    >
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-10">
        <PageHeader
          eyebrow="operations / reservations"
          title="예약 운영"
          description="오늘 접수된 예약을 확인하고, pending 상태의 요청을 처리합니다."
          action={
            <div className="rounded-md border border-border bg-surface px-4 py-3 text-right">
              <p className="text-xs text-muted-foreground">현재 대기</p>
              <p className="text-xl font-black tabular-nums">
                {ordersQuery.data?.total ?? 0}
                <span className="ml-1 text-sm font-medium">건</span>
              </p>
            </div>
          }
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
          <section className="min-w-0 rounded-lg border border-border bg-surface p-5">
            <SectionHeader
              title="예약 목록"
              action={
                <select
                  aria-label="예약 상태 필터"
                  value={status}
                  onChange={(event) => setStatus(event.target.value as OrderStatus | '')}
                  className="h-10 rounded-md border border-border bg-surface px-3 text-sm"
                >
                  <option value="pending">대기 중</option>
                  <option value="confirmed">확정</option>
                  <option value="cancelled">취소</option>
                  <option value="">전체</option>
                </select>
              }
            />
            {ordersQuery.isLoading && <LoadingState rows={5} />}
            {ordersQuery.isError && <ErrorState onRetry={() => void ordersQuery.refetch()} />}
            {!ordersQuery.isLoading && !ordersQuery.isError && orders.length === 0 && (
              <EmptyState
                title="처리할 예약이 없습니다"
                description="선택한 상태의 예약이 새로 들어오면 여기에 표시됩니다."
              />
            )}
            {orders.length > 0 && (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left text-sm">
                  <thead className="border-y border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="py-3 pr-4">예약자 / 숙소</th>
                      <th className="py-3 pr-4">객실</th>
                      <th className="py-3 pr-4">일정</th>
                      <th className="py-3 pr-4">상태</th>
                      <th className="py-3 text-right">작업</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-muted/30">
                        <td className="py-4 pr-4">
                          <button
                            type="button"
                            onClick={() => setSelectedOrder(order)}
                            className="text-left"
                          >
                            <p className="font-bold">{order.guestName}</p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              {order.productName}
                            </p>
                          </button>
                        </td>
                        <td className="py-4 pr-4 text-muted-foreground">{order.roomName}</td>
                        <td className="py-4 pr-4">
                          <p>
                            {order.nights}박 · {order.guestCount}명
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            ₩{numberFormat.format(order.totalPrice)}
                          </p>
                        </td>
                        <td className="py-4 pr-4">
                          <StatusBadge status={order.status} />
                        </td>
                        <td className="py-4 text-right">
                          {order.status === 'pending' && (
                            <div className="flex justify-end gap-2">
                              <Button
                                className="px-3 py-1.5"
                                onClick={() => void updateStatus(order, 'confirmed')}
                                disabled={updateMutation.isPending}
                              >
                                {updateMutation.isPending ? <Spinner /> : '확정'}
                              </Button>
                              <Button
                                className="px-3 py-1.5"
                                variant="destructive"
                                onClick={() => void updateStatus(order, 'cancelled')}
                                disabled={updateMutation.isPending}
                              >
                                취소
                              </Button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
          {selectedOrder ? (
            <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(undefined)} />
          ) : (
            <div className="hidden rounded-lg border border-dashed border-border p-6 text-sm text-muted-foreground lg:block">
              목록에서 예약을 선택하면 상세 정보가 표시됩니다.
            </div>
          )}
        </div>
      </div>
      {toast && <Toast message={toast} />}
    </AppShell>
  );
}
