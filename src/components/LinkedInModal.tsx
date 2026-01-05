import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, Linkedin } from 'lucide-react'

interface LinkedInModalProps {
  open: boolean
  onSubmit: (linkedInUrl: string) => Promise<void>
}

export function LinkedInModal({ open, onSubmit }: LinkedInModalProps) {
  const [linkedInUrl, setLinkedInUrl] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateLinkedIn = (url: string) => {
    if (!url) return false
    return url.includes('linkedin.com/in/') || url.includes('linkedin.com/company/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!validateLinkedIn(linkedInUrl)) {
      setError('Please enter a valid LinkedIn profile URL (e.g., https://linkedin.com/in/yourname)')
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit(linkedInUrl)
    } catch (err: any) {
      setError(err.message || 'Failed to update profile')
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[500px]" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-blue-600" />
            LinkedIn Profile Required
          </DialogTitle>
          <DialogDescription>
            To ensure transparency in voting, all participants must provide their LinkedIn profile.
            This helps verify voter identity and prevents duplicate voting.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4 py-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="linkedin">Your LinkedIn Profile URL *</Label>
              <Input
                id="linkedin"
                type="url"
                value={linkedInUrl}
                onChange={(e) => setLinkedInUrl(e.target.value)}
                placeholder="https://linkedin.com/in/yourname"
                required
                disabled={isSubmitting}
              />
              <p className="text-xs text-muted-foreground">
                Example: https://linkedin.com/in/john-doe
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? 'Saving...' : 'Continue to Vote'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
