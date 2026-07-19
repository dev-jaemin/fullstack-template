import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useCreateOrder } from '@repo/order/client';
import type { CreateOrderInput } from '@repo/order/contract';
import { useProducts } from '@repo/product/client';
import type { Product, ProductCategory } from '@repo/product/contract';
import {
  AppShell,
  Button,
  EmptyState,
  ErrorState,
  Input,
  LinkArrow,
  LoadingState,
  PageHeader,
  SearchInput,
  SectionHeader,
  Spinner,
  Toast,
} from '@repo/ui';

const categories: Array<{ value: ProductCategory | ''; label: string }> = [
  { value: '', label: '모든 유형' },
  { value: 'hotel', label: '호텔' },
  { value: 'resort', label: '리조트' },
  { value: 'pension', label: '스테이' },
  { value: 'camping', label: '캠핑' },
];
const numberFormat = new Intl.NumberFormat('ko-KR');

function ProductCard({
  product,
  onReserve,
}: {
  product: Product;
  onReserve: (product: Product) => void;
}) {
  return (
    <article className="group overflow-hidden rounded-lg border border-border bg-surface shadow-sm transition hover:-translate-y-1 hover:shadow-soft">
      <div
        className={`flex h-44 items-end bg-gradient-to-br p-5 text-white ${product.accent === 'coral' ? 'from-rose-400 to-orange-300' : product.accent === 'sunset' ? 'from-orange-300 to-yellow-200' : product.accent === 'forest' ? 'from-emerald-700 to-lime-500' : product.accent === 'midnight' ? 'from-slate-800 to-indigo-500' : 'from-teal-700 to-cyan-300'}`}
      >
        <span className="rounded-full bg-black/20 px-3 py-1 text-xs font-bold backdrop-blur">
          {product.city} · {product.category}
        </span>
      </div>
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="font-bold">{product.name}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
          </div>
          <span className="text-sm font-bold text-warning">★ {product.rating.toFixed(1)}</span>
        </div>
        <div className="mt-6 flex items-end justify-between">
          <p>
            <span className="text-lg font-black">
              ₩{numberFormat.format(product.pricePerNight)}
            </span>
            <span className="text-xs text-muted-foreground"> / 1박</span>
          </p>
          <Button onClick={() => onReserve(product)}>
            예약하기 <LinkArrow />
          </Button>
        </div>
      </div>
    </article>
  );
}

function ReservationPanel({
  product,
  onClose,
  onSuccess,
}: {
  product: Product;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const createOrderMutation = useCreateOrder();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Omit<CreateOrderInput, 'productId' | 'productName' | 'pricePerNight'>>({
    defaultValues: { guestCount: 2, nights: 1, roomName: '기본 스테이룸' },
  });
  const submit = handleSubmit(async (values) => {
    await createOrderMutation.mutateAsync({
      ...values,
      productId: product.id,
      productName: product.name,
      pricePerNight: product.pricePerNight,
    });
    onSuccess();
  });
  return (
    <div
      className="fixed inset-0 z-30 flex items-end justify-center bg-foreground/40 p-4 md:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reservation-title"
    >
      <form onSubmit={submit} className="w-full max-w-lg rounded-lg bg-surface p-6 shadow-soft">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
              new reservation
            </p>
            <h2 id="reservation-title" className="mt-1 text-xl font-black">
              {product.name}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="text-2xl text-muted-foreground"
          >
            ×
          </button>
        </div>
        <div className="grid gap-4">
          <div className="text-sm font-semibold">
            <label htmlFor="guestName">예약자명</label>
            <Input
              id="guestName"
              {...register('guestName', { required: '예약자명을 입력해주세요.' })}
              placeholder="이름을 입력해주세요"
            />
            {errors.guestName && (
              <span className="text-xs text-destructive">{errors.guestName.message}</span>
            )}
          </div>
          <div className="text-sm font-semibold">
            <label htmlFor="roomName">객실명</label>
            <Input id="roomName" {...register('roomName', { required: true })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-sm font-semibold">
              <label htmlFor="guestCount">인원</label>
              <Input
                id="guestCount"
                type="number"
                {...register('guestCount', { valueAsNumber: true, min: 1 })}
              />
            </div>
            <div className="text-sm font-semibold">
              <label htmlFor="nights">숙박 박수</label>
              <Input
                id="nights"
                type="number"
                {...register('nights', { valueAsNumber: true, min: 1 })}
              />
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button type="submit" disabled={createOrderMutation.isPending}>
            {createOrderMutation.isPending && <Spinner />}예약 요청 보내기
          </Button>
        </div>
        {createOrderMutation.isError && (
          <p className="mt-3 text-sm text-destructive">
            예약에 실패했습니다. 입력값을 확인해주세요.
          </p>
        )}
      </form>
    </div>
  );
}

export function App() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<ProductCategory | ''>('');
  const [selectedProduct, setSelectedProduct] = useState<Product>();
  const [toast, setToast] = useState(false);
  const query = category ? { search, category } : { search };
  const productsQuery = useProducts(query);
  const products = productsQuery.data?.data ?? [];
  return (
    <AppShell
      navigation={
        <nav className="hidden gap-6 text-sm font-semibold text-muted-foreground md:flex">
          <a className="text-foreground" href="/">
            숙소 찾기
          </a>
          <a href="http://localhost:5174">예약 관리</a>
        </nav>
      }
    >
      <div className="mx-auto max-w-7xl px-6 pb-20 pt-12">
        <PageHeader
          eyebrow="stayline / explore"
          title="쉬어갈 곳을 찾는 가장 가벼운 방법"
          description="가상의 스테이 컬렉션에서 오늘의 취향에 맞는 숙소를 골라보세요."
        />
        <section className="mt-10 rounded-lg bg-primary p-5 text-primary-foreground shadow-soft md:p-7">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-sm font-bold opacity-80">어디로 떠날까요?</p>
              <h2 className="mt-1 text-xl font-black">다음 여행의 장면을 검색해보세요</h2>
            </div>
            <span className="hidden text-4xl md:block">⌁</span>
          </div>
          <div className="grid gap-3 rounded-md bg-surface p-3 text-foreground md:grid-cols-[1fr_180px_auto]">
            <SearchInput value={search} onChange={setSearch} />
            <select
              aria-label="숙소 유형"
              value={category}
              onChange={(event) => setCategory(event.target.value as ProductCategory | '')}
              className="h-11 rounded-md border border-border bg-surface px-3 text-sm"
            >
              <option value="">모든 유형</option>
              {categories.slice(1).map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
            <Button onClick={() => void productsQuery.refetch()}>검색</Button>
          </div>
        </section>
        <section className="mt-12">
          <SectionHeader
            title="지금 둘러보기"
            action={
              <span className="text-sm text-muted-foreground">
                {productsQuery.data?.total ?? 0}곳의 스테이
              </span>
            }
          />
          {productsQuery.isLoading && <LoadingState rows={4} />}
          {productsQuery.isError && <ErrorState onRetry={() => void productsQuery.refetch()} />}
          {!productsQuery.isLoading && !productsQuery.isError && products.length === 0 && (
            <EmptyState
              title="조건에 맞는 스테이가 없어요"
              description="검색어를 조금 바꾸거나 다른 유형을 선택해보세요."
            />
          )}
          {products.length > 0 && (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} onReserve={setSelectedProduct} />
              ))}
            </div>
          )}
        </section>
      </div>
      {selectedProduct && (
        <ReservationPanel
          product={selectedProduct}
          onClose={() => setSelectedProduct(undefined)}
          onSuccess={() => {
            setSelectedProduct(undefined);
            setToast(true);
            window.setTimeout(() => setToast(false), 3000);
          }}
        />
      )}
      {toast && <Toast message="예약 요청이 접수되었습니다." />}
    </AppShell>
  );
}
