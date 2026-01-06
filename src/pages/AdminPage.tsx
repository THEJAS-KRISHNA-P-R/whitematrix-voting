import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogOut, Plus, Pencil, Trash2, AlertCircle, CheckCircle, ArrowLeft, Users } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import type { Candidate } from '@/types'

interface VoteRecord {
  voter_id: string
  candidate_id: string
  voted_at: string
  voter_name: string
  voter_email: string
  voter_photo: string | null
}

export function AdminPage() {
  const navigate = useNavigate()
  const { signOut } = useAuth()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  
  // Vote tracking state
  const [votes, setVotes] = useState<VoteRecord[]>([])
  const [selectedCandidate, setSelectedCandidate] = useState<string>('all')
  const [loadingVotes, setLoadingVotes] = useState(false)

  // Form state
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [linkedInProfile, setLinkedInProfile] = useState('')

  useEffect(() => {
    fetchCandidates()
    fetchVotes()
  }, [])

  const fetchCandidates = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error && data) {
      setCandidates(data.map(c => ({
        id: c.id,
        name: c.name,
        description: c.bio || c.description || '',
        photoURL: c.photo_url || '',
        linkedInProfile: c.linkedin_profile || '',
        voteCount: c.vote_count || 0,
      })))
    }
    setLoading(false)
  }

  const fetchVotes = async () => {
    setLoadingVotes(true)
    const { data, error } = await supabase
      .from('votes')
      .select(`
        voter_id,
        candidate_id,
        voted_at,
        users!inner(
          id,
          email,
          display_name,
          photo_url
        )
      `)
      .order('voted_at', { ascending: false })

    if (!error && data) {
      setVotes(data.map((v: any) => ({
        voter_id: v.voter_id,
        candidate_id: v.candidate_id,
        voted_at: v.voted_at,
        voter_name: v.users.display_name || 'Anonymous',
        voter_email: v.users.email || '',
        voter_photo: v.users.photo_url,
      })))
    }
    setLoadingVotes(false)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const resetForm = () => {
    setName('')
    setBio('')
    setPhotoUrl('')
    setLinkedInProfile('')
    setEditing(null)
    setError(null)
  }

  const validateLinkedIn = (url: string) => {
    return url.includes('linkedin.com/in/') || url.includes('linkedin.com/company/')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)

    if (!validateLinkedIn(linkedInProfile)) {
      setError('Please enter a valid LinkedIn profile URL')
      return
    }

    try {
      if (editing) {
        // Update existing candidate
        const { error } = await supabase
          .from('candidates')
          .update({
            name,
            bio,
            photo_url: photoUrl,
            linkedin_profile: linkedInProfile,
          })
          .eq('id', editing)

        if (error) throw error
        setSuccess('Candidate updated successfully!')
      } else {
        // Add new candidate
        const { error } = await supabase
          .from('candidates')
          .insert({
            name,
            bio,
            photo_url: photoUrl,
            linkedin_profile: linkedInProfile,
          })

        if (error) throw error
        setSuccess('Candidate added successfully!')
      }

      resetForm()
      fetchCandidates()
      fetchVotes()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    }
  }

  const handleEdit = (candidate: Candidate) => {
    setName(candidate.name)
    setBio(candidate.description)
    setPhotoUrl(candidate.photoURL)
    setLinkedInProfile(candidate.linkedInProfile)
    setEditing(candidate.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this candidate?')) return

    try {
      const { error } = await supabase
        .from('candidates')
        .delete()
        .eq('id', id)

      if (error) throw error
      setSuccess('Candidate deleted successfully!')
      fetchCandidates()
      fetchVotes()
    } catch (err: any) {
      setError(err.message || 'Failed to delete candidate')
    }
  }

  const filteredVotes = selectedCandidate === 'all' 
    ? votes 
    : votes.filter(v => v.candidate_id === selectedCandidate)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img src="/favicon.png" alt="SimpleVote" className="w-14 h-8" />
              <span className="font-bold text-lg">SimpleVote</span>
            </div>
            <span className="text-sm bg-primary/10 text-primary px-3 py-1 rounded-full">Admin Panel</span>
          </div>

          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard')}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Dashboard</span>
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Success/Error Messages */}
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 border-green-500 bg-green-50 text-green-900">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        {/* Add/Edit Candidate Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              {editing ? 'Edit Candidate' : 'Add New Candidate'}
            </CardTitle>
            <CardDescription>
              {editing ? 'Update candidate information' : 'Add a new candidate to the voting system'}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Candidate Name *</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn Profile URL *</Label>
                  <Input
                    id="linkedin"
                    value={linkedInProfile}
                    onChange={(e) => setLinkedInProfile(e.target.value)}
                    placeholder="https://linkedin.com/in/johndoe"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="photo">Profile Photo URL *</Label>
                <Input
                  id="photo"
                  value={photoUrl}
                  onChange={(e) => setPhotoUrl(e.target.value)}
                  placeholder="https://example.com/photo.jpg"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Biography/Description *</Label>
                <textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full min-h-[100px] px-3 py-2 rounded-md border border-input bg-background"
                  placeholder="Experienced leader with 10+ years in technology..."
                  required
                />
              </div>
            </CardContent>

            <CardFooter className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editing ? 'Update Candidate' : 'Add Candidate'}
              </Button>
              {editing && (
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
              )}
            </CardFooter>
          </form>
        </Card>

        {/* Vote Viewer Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Vote Records ({filteredVotes.length})
            </CardTitle>
            <CardDescription>
              See who voted for which candidate
            </CardDescription>
          </CardHeader>

          <CardContent>
            <div className="space-y-4">
              {/* Candidate Filter Dropdown */}
              <div className="space-y-2">
                <Label htmlFor="candidate-filter">Filter by Candidate</Label>
                <select
                  id="candidate-filter"
                  value={selectedCandidate}
                  onChange={(e) => setSelectedCandidate(e.target.value)}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background"
                >
                  <option value="all">All Candidates ({votes.length} votes)</option>
                  {candidates.map((candidate) => {
                    const voteCount = votes.filter(v => v.candidate_id === candidate.id).length
                    return (
                      <option key={candidate.id} value={candidate.id}>
                        {candidate.name} ({voteCount} votes)
                      </option>
                    )
                  })}
                </select>
              </div>

              {/* Vote List */}
              {loadingVotes ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                </div>
              ) : filteredVotes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No votes recorded yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredVotes.map((vote, index) => {
                    const candidate = candidates.find(c => c.id === vote.candidate_id)
                    return (
                      <div
                        key={`${vote.voter_id}-${vote.candidate_id}-${index}`}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <img
                          src={vote.voter_photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(vote.voter_name)}`}
                          alt={vote.voter_name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{vote.voter_name}</div>
                          <div className="text-sm text-muted-foreground">{vote.voter_email}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            Voted for: <span className="text-primary">{candidate?.name || 'Unknown'}</span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(vote.voted_at).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Existing Candidates */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Candidates ({candidates.length})</h2>
          
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : candidates.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                No candidates added yet. Add your first candidate above.
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {candidates.map((candidate) => (
                <Card key={candidate.id}>
                  <CardHeader className="flex-row items-start gap-4 space-y-0">
                    <img
                      src={candidate.photoURL}
                      alt={candidate.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div className="flex-1">
                      <CardTitle>{candidate.name}</CardTitle>
                      <CardDescription className="line-clamp-2 mt-1">
                        {candidate.description}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">LinkedIn:</span>{' '}
                        <a
                          href={candidate.linkedInProfile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          View Profile
                        </a>
                      </div>
                      <div>
                        <span className="font-medium">Total Votes:</span> {candidate.voteCount}
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleEdit(candidate)}
                    >
                      <Pencil className="h-4 w-4 mr-1" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(candidate.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
