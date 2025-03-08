// components/AICoach.tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CardSpotlight } from '@/components/ui/card-spotlight'
import { Loader2 } from 'lucide-react'

export default function AICoach() {
    const [advice, setAdvice] = useState('')
    const [loading, setLoading] = useState(false)

    const getAdvice = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/ai/advice', { method: 'POST' })
            const data = await res.json()
            setAdvice(data.advice)
        } finally {
            setLoading(false)
        }
    }

    return (
        <CardSpotlight className="max-w-md min-h-[420px] relative overflow-hidden">
            <div className="h-full flex flex-col p-6 bg-gradient-to-br bg-transparent text-white">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <span className="text-primary">🤖</span>
                        <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                            AI Coach
                        </span>
                    </h3>
                    <Button
                        onClick={getAdvice}
                        disabled={loading}
                        size="sm"
                        className="relative overflow-hidden transition-transform hover:scale-105"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Analyzing
                            </>
                        ) : (
                            'Get Advice'
                        )}
                    </Button>
                </div>

                <div className="flex-1 flex flex-col justify-center">
                    {advice ? (
                        <div className="mx-10 space-y-2 text-sm border-none  rounded border">
                            {advice.split('**').map((segment, index) => (
                                <div
                                    key={index}
                                    className={index % 2 === 1 ? "font-extrabold text-blue-600" : ""}
                                >
                                    {segment}
                                </div>
                            ))}
                        </div>

                    ) : (
                        <div className="flex flex-col items-center justify-center text-center h-full space-y-4">
                            <div className="text-muted-foreground/80 text-lg">
                                <p className="mb-2 text-white">Ready to optimize your workflow?</p>
                                <p className="text-sm opacity-75 text-white">
                                    Get personalized AI productivity tips
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                {!advice && (
                    <div className="mt-4 text-xs text-muted-foreground/50 text-center">
                        Tips update daily based on your activity
                    </div>
                )}
            </div>
        </CardSpotlight>
    )
}