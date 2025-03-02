'use client'
import { useState, useEffect } from 'react'
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'
import { format } from 'date-fns'
import { Skeleton } from '@/components/ui/skeleton'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { motion } from "framer-motion"
import { AuroraBackground } from '@/components/ui/background'

interface TimeLog {
  id: string
  sessionTime: number
  createdAt: string
  activity: {
    id: string
    activityTitle: string
  }
}

const groupByPeriod = (data: TimeLog[], period: 'week' | 'month' | 'year') => {
  const grouped: { [key: string]: number } = {}

  data.forEach(log => {
    const date = new Date(log.createdAt)
    let key
    
    if (period === 'week') {
      key = format(date, 'yyyy-MM-dd')
    } else if (period === 'month') {
      key = format(date, 'yyyy-MM')
    } else {
      key = format(date, 'yyyy')
    }
    
    grouped[key] = (grouped[key] || 0) + log.sessionTime
  })

  return Object.entries(grouped).map(([date, total]) => ({
    date,
    total: total / 3600
  }))
}

const groupByActivity = (data: TimeLog[]) => {
  const grouped: { [key: string]: number } = {}

  data.forEach(log => {
    const activity = log.activity.activityTitle
    grouped[activity] = (grouped[activity] || 0) + log.sessionTime
  })

  return Object.entries(grouped).map(([activity, total]) => ({
    activity,
    total: total / 3600
  }))
}

const ChartTooltip = ({ active, payload }: any) => {
  if (!active || !payload) return null
  
  return (
    <div className="bg-background p-3 rounded-lg border shadow-sm">
      <p className="font-medium">{payload[0].payload.date || payload[0].payload.activity}</p>
      <p className="text-sm text-muted-foreground">
        {payload[0].value.toFixed(1)} hours
      </p>
    </div>
  )
}

export default function TimeLogCharts() {
  const [timePeriod, setTimePeriod] = useState<'week' | 'month' | 'year'>('week')
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/timelog/get-created-timelogs')
        const { timelog } = await response.json()
        setTimeLogs(timelog)
      } catch (error) {
        console.error('Error fetching timelogs:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full" />
          </CardContent>
        </Card>
        {/* Repeat for other cards */}
      </div>
    )
  }

  if (!timeLogs.length) {
    return (
      <Card>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">No time logs available</p>
        </CardContent>
      </Card>
    )
  }

  const periodData = groupByPeriod(timeLogs, timePeriod)
  const activityData = groupByActivity(timeLogs)

  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl  mt-32  "
      >
        <div className="space-y-6  mt-5  ">
          <div className="flex justify-between items-center">
            <h2 className="text-3xl font-bold text-foreground text-white">Time Analytics</h2>
            <Select value={timePeriod} onValueChange={(v: any) => setTimePeriod(v)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="week">Weekly</SelectItem>
                <SelectItem value="month">Monthly</SelectItem>
                <SelectItem value="year">Yearly</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Time Logged ({timePeriod})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={periodData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={date => format(new Date(date), timePeriod === 'week' ? 'MMM dd' : 'MMM yyyy')}
                        className="text-muted-foreground"
                      />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="total"
                        stroke="hsl(var(--primary))"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className=''>
                <CardTitle>Activity Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={activityData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                      <XAxis 
                        dataKey="activity" 
                        className="text-muted-foreground"
                      />
                      <YAxis className="text-muted-foreground" />
                      <Tooltip content={<ChartTooltip />} />
                      <Legend />
                      <Bar
                        dataKey="total"
                        fill="hsl(var(--primary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card className="md:col-span-2 ">
              <CardHeader>
                <CardTitle>Activity Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={activityData}
                        dataKey="total"
                        nameKey="activity"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        innerRadius={80}
                        paddingAngle={2}
                      >
                        {activityData.map((_, index) => (
                          <Cell 
                            key={`cell-${index}`}
                            className="stroke-background stroke-2"
                            fill={`hsl(var(--${[
                              'primary',
                              'secondary',
                              'destructive',
                              'warning',
                              'accent'
                            ][index % 5]}))`}
                          />
                        ))}
                      </Pie>
                      <Tooltip content={<ChartTooltip />} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

          </div>
        </div>
      </motion.div>
    </AuroraBackground>
  )
}