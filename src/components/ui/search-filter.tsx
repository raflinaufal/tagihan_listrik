'use client'

import { ReactNode } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Filter, X } from 'lucide-react'
import { useState } from 'react'

interface SearchFilterProps {
  placeholder?: string
  value: string
  onChange: (value: string) => void
  onClear?: () => void
  children?: ReactNode
  className?: string
}

export function SearchFilter({ 
  placeholder = "Cari...",
  value,
  onChange,
  onClear,
  children,
  className = ""
}: SearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  return (
    <div className={`flex flex-col sm:flex-row gap-4 ${className}`}>
      {/* Search Input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="pl-10 pr-10"
        />
        {value && (
          <button
            onClick={() => {
              onChange('')
              onClear?.()
            }}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Filter Toggle (Mobile) */}
      <div className="sm:hidden">
        <Button
          variant="outline"
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full"
        >
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2">
        {children}
      </div>

      {/* Mobile Filter Panel */}
      {isFilterOpen && (
        <div className="sm:hidden mt-4 p-4 bg-gray-50 rounded-lg border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium">Filter</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsFilterOpen(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          {/* Add filter options here */}
          <div className="space-y-3">
            {/* Example filter options */}
            <div>
              <label className="text-sm font-medium">Status</label>
              <select className="w-full mt-1 border rounded p-2 text-sm">
                <option value="">Semua</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak Aktif</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Desktop filter component
export function DesktopFilter({ children }: { children: ReactNode }) {
  return (
    <div className="hidden sm:flex items-center gap-2">
      {children}
    </div>
  )
} 