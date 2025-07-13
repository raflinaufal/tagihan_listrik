'use client'

import { ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'

interface StatsCardProps {
  title: string
  value: string | number
  icon: LucideIcon
  iconColor?: string
  description?: string
  trend?: {
    value: string | number
    isPositive: boolean
  }
  className?: string
}

export function StatsCard({ 
  title, 
  value, 
  icon: Icon, 
  iconColor = "text-blue-600",
  description,
  trend,
  className = ""
}: StatsCardProps) {
  return (
    <Card className={`hover:shadow-md transition-shadow ${className}`}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className={`h-4 w-4 ${iconColor}`} />
      </CardHeader>
      <CardContent>
        <div className="text-xl sm:text-2xl font-bold text-gray-900">
          {value}
        </div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
        {trend && (
          <div className="flex items-center mt-2">
            <span className={`text-xs ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
              {trend.isPositive ? '↗' : '↘'} {trend.value}
            </span>
            <span className="text-xs text-gray-500 ml-1">
              dari bulan lalu
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Grid container for stats cards
export function StatsGrid({ children }: { children: ReactNode }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {children}
    </div>
  )
} 