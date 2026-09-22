import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number, formatType: 'full' | 'compact' = 'compact'): string {
  if (formatType === 'compact') {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(1)}Cr`;
    }
    if (amount >= 100000) {
      const lakh = amount / 100000;
      return `₹${lakh % 1 === 0 ? lakh.toFixed(0) : lakh.toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(0)}k`;
    }
    return `₹${amount}`;
  }

  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function getStatusBadgeClass(status: string): string {
  switch (status) {
    case 'Won':
    case 'Accepted':
    case 'Completed':
    case 'Paid Full':
    case 'Active':
      return 'bg-emerald-100 text-emerald-800 border-emerald-300';
    case 'Prospect':
    case 'Interested':
    case 'Proposal Sent':
    case 'Qualified':
    case 'Today':
      return 'bg-amber-100 text-amber-900 border-amber-300';
    case 'Overdue':
    case 'Lost':
    case 'Rejected':
    case 'Cancelled':
    case 'Invalid Lead':
      return 'bg-rose-100 text-rose-800 border-rose-300';
    case 'Negotiation':
    case 'Proposal Requested':
    case 'Requirement Discussion':
      return 'bg-blue-100 text-blue-800 border-blue-300';
    case 'New':
    case 'Upcoming':
    case 'Draft':
      return 'bg-slate-100 text-slate-800 border-slate-300';
    case 'Contacted':
    case 'Follow-up':
      return 'bg-purple-100 text-purple-800 border-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-300';
  }
}

export function getPriorityBadgeClass(priority: string): string {
  switch (priority) {
    case 'High':
      return 'bg-rose-100 text-rose-800 border-rose-200';
    case 'Medium':
      return 'bg-amber-100 text-amber-800 border-amber-200';
    case 'Low':
      return 'bg-slate-100 text-slate-700 border-slate-200';
    default:
      return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}
