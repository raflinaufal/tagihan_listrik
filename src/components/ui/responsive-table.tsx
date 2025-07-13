'use client'

import { ReactNode } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'

interface ResponsiveTableProps {
  headers: string[]
  children: ReactNode
  mobileCardRenderer?: (item: any, index: number) => ReactNode
  className?: string
}

export function ResponsiveTable({ 
  headers, 
  children, 
  mobileCardRenderer,
  className = "" 
}: ResponsiveTableProps) {
  return (
    <div className={`rounded-lg border overflow-hidden ${className}`}>
      {/* Desktop Table */}
      <div className="hidden lg:block">
        <Table>
          <TableHeader>
            <TableRow className="bg-gray-50">
              {headers.map((header, index) => (
                <TableHead key={index} className="font-semibold">
                  {header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {children}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden">
        {mobileCardRenderer}
      </div>
    </div>
  )
}

// Helper component for mobile card items
export function MobileCardItem({ 
  children, 
  className = "" 
}: { 
  children: ReactNode
  className?: string 
}) {
  return (
    <div className={`border-b border-gray-200 p-4 hover:bg-gray-50 ${className}`}>
      {children}
    </div>
  )
}

// Helper component for mobile card badges
export function MobileCardBadge({ 
  children, 
  variant = "secondary" 
}: { 
  children: ReactNode
  variant?: "default" | "secondary" | "destructive" | "outline"
}) {
  return (
    <Badge variant={variant}>
      {children}
    </Badge>
  )
} 