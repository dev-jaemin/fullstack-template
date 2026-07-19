import React from 'react';
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { AlertCircle, Check, ChevronRight, LoaderCircle, Search } from 'lucide-react';

export function AppShell({
  children,
  navigation,
  brand = 'stayline',
}: {
  children: ReactNode;
  navigation?: ReactNode;
  brand?: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <a className="text-lg font-black tracking-tight text-primary" href="/">
            {brand}
          </a>
          {navigation}
        </div>
      </header>
      <main>{children}</main>
    </div>
  );
}

export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {eyebrow && (
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-primary">
            {eyebrow}
          </p>
        )}
        <h1 className="text-3xl font-black tracking-tight md:text-4xl">{title}</h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  );
}

export function SectionHeader({ title, action }: { title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-lg font-bold">{title}</h2>
      {action}
    </div>
  );
}

export function Button({
  className = '',
  variant = 'primary',
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
}) {
  const variants = {
    primary: 'bg-primary text-primary-foreground hover:opacity-90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-muted',
    ghost: 'text-muted-foreground hover:bg-muted hover:text-foreground',
    destructive: 'bg-destructive text-white hover:opacity-90',
  };
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-focus-ring disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${className}`}
      {...props}
    />
  );
}

export const Input = React.forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  function Input({ className = '', ...props }, ref) {
    return (
      <input
        ref={ref}
        className={`h-11 w-full rounded-md border border-border bg-surface px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-focus-ring/20 ${className}`}
        {...props}
      />
    );
  },
);

export function SearchInput({
  value,
  onChange,
  placeholder = '숙소명, 지역을 검색해보세요',
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative block">
      <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
      <Input
        aria-label={placeholder}
        className="pl-10"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === 'confirmed' || status === 'active'
      ? 'bg-success/10 text-success'
      : status === 'cancelled' || status === 'inactive'
        ? 'bg-destructive/10 text-destructive'
        : 'bg-warning/10 text-warning';
  const label: Record<string, string> = {
    pending: '대기 중',
    confirmed: '확정',
    cancelled: '취소',
    active: '판매 중',
    inactive: '판매 중지',
  };
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${tone}`}>
      {label[status] ?? status}
    </span>
  );
}

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
      <p className="font-bold">{title}</p>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({
  message = '잠시 후 다시 시도해주세요.',
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <div
      role="alert"
      className="flex items-center justify-between gap-4 rounded-lg border border-destructive/20 bg-destructive/5 px-5 py-4 text-sm text-destructive"
    >
      <span className="flex items-center gap-2">
        <AlertCircle className="h-4 w-4" />
        {message}
      </span>
      {onRetry && (
        <Button variant="ghost" onClick={onRetry}>
          다시 시도
        </Button>
      )}
    </div>
  );
}

export function LoadingState({ rows = 3 }: { rows?: number }) {
  return (
    <div aria-label="불러오는 중" className="space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <div key={index} className="h-20 animate-pulse rounded-lg bg-muted" />
      ))}
    </div>
  );
}

export function Toast({
  message,
  kind = 'success',
}: {
  message: string;
  kind?: 'success' | 'error';
}) {
  return (
    <div
      className={`fixed bottom-6 right-6 z-20 flex items-center gap-2 rounded-md px-4 py-3 text-sm font-semibold text-white shadow-soft ${kind === 'success' ? 'bg-success' : 'bg-destructive'}`}
    >
      <Check className="h-4 w-4" />
      {message}
    </div>
  );
}

export function Spinner() {
  return <LoaderCircle className="h-4 w-4 animate-spin" />;
}
export function LinkArrow() {
  return <ChevronRight className="h-4 w-4" />;
}
