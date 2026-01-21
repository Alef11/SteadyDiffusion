import { useHealthCheck } from '@/hooks/useHealthCheck'
import { Activity, AlertCircle } from 'lucide-react'

export function HealthStatus() {
  const { isHealthy, lastCheck } = useHealthCheck(10000)

  const formatTime = (date: Date | null) => {
    if (!date) return 'Never'
    return date.toLocaleTimeString()
  }

  return (
    <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-center">
        <div className="flex items-center gap-2 text-sm">
          {isHealthy ? (
            <>
              <Activity className="h-4 w-4 text-green-500" />
              <span className="text-muted-foreground">
                API Status: <span className="font-semibold text-green-500">Online</span>
              </span>
            </>
          ) : (
            <>
              <AlertCircle className="h-4 w-4 text-red-500" />
              <span className="text-muted-foreground">
                API Status: <span className="font-semibold text-red-500">Offline</span>
              </span>
            </>
          )}
          <span className="text-muted-foreground ml-4 text-xs">
            Last check: {formatTime(lastCheck)}
          </span>
        </div>
      </div>
    </div>
  )
}
