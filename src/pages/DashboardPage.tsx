import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Vote, LogOut, Trophy, Linkedin, CheckCircle, Loader2, Settings } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/lib/supabase'
import { LinkedInModal } from '@/components/LinkedInModal'
import type { Candidate } from '@/types'

export function DashboardPage() {
  const navigate = useNavigate()
  const { user, signOut } = useAuth()
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [hasVoted, setHasVoted] = useState(false)
  const [votedFor, setVotedFor] = useState<string | null>(null)
  const [isVoting, setIsVoting] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showLinkedInModal, setShowLinkedInModal] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const [expandedBios, setExpandedBios] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchCandidates()
    checkIfVoted()
    checkIfAdmin()
    checkUserProfile()
  }, [user])

  const checkUserProfile = async () => {
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    setUserProfile(data)

    // Show LinkedIn modal if not admin and no LinkedIn profile
    if (data && !data.is_admin && !data.linkedin_profile) {
      setShowLinkedInModal(true)
    }
  }

  const handleLinkedInSubmit = async (linkedInUrl: string) => {
    if (!user) return

    const { error } = await supabase
      .from('profiles')
      .update({ linkedin_profile: linkedInUrl })
      .eq('id', user.id)

    if (error) throw error

    setShowLinkedInModal(false)
    await checkUserProfile()
  }

  const checkIfAdmin = async () => {
    if (!user) return

    const { data } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    setIsAdmin(data?.is_admin || false)
  }

  const fetchCandidates = async () => {
    const { data, error } = await supabase
      .from('candidates')
      .select('*')
      .order('name')

    if (!error && data) {
      // Get actual vote counts from votes table
      const { data: votesData } = await supabase
        .from('votes')
        .select('candidate_id')

      // Count votes per candidate
      const voteCounts: Record<string, number> = {}
      votesData?.forEach(vote => {
        voteCounts[vote.candidate_id] = (voteCounts[vote.candidate_id] || 0) + 1
      })

      setCandidates(data.map(c => ({
        id: c.id,
        name: c.name,
        description: c.bio || c.description || '',
        photoURL: c.photo_url || '',
        linkedInProfile: c.linkedin_profile || '',
        voteCount: voteCounts[c.id] || 0, // Use actual count from votes table
      })))
    }
    setLoading(false)
  }

  const checkIfVoted = async () => {
    if (!user) return

    const { data } = await supabase
      .from('votes')
      .select('candidate_id')
      .eq('user_id', user.id)
      .single()

    if (data) {
      setHasVoted(true)
      setVotedFor(data.candidate_id)
    }
  }

  const handleVote = async (candidateId: string) => {
    if (!user || !userProfile) return

    // Check if user has LinkedIn profile
    if (!userProfile.linkedin_profile && !userProfile.is_admin) {
      setShowLinkedInModal(true)
      return
    }

    setIsVoting(candidateId)

    try {
      // Get user's display name
      const voterName = userProfile.full_name || user.email?.split('@')[0] || 'Anonymous'
      const voterLinkedIn = userProfile.linkedin_profile || ''

      // Insert vote with voter information
      const { error: voteError } = await supabase
        .from('votes')
        .insert({
          user_id: user.id,
          candidate_id: candidateId,
          voter_name: voterName,
          voter_linkedin: voterLinkedIn,
        })

      if (voteError) throw voteError

      // Increment vote count
      const { error: updateError } = await supabase.rpc('increment_vote_count', {
        candidate_id: candidateId,
      })

      if (updateError) throw updateError

      setHasVoted(true)
      setVotedFor(candidateId)
      await fetchCandidates()
    } catch (error) {
      console.error('Error voting:', error)
    } finally {
      setIsVoting(null)
    }
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="SimpleVote" className="w-14 h-8" />
            <span className="font-bold text-lg">SimpleVote</span>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback>
                  {user?.email?.charAt(0).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">
                  {user?.user_metadata?.full_name || 'User'}
                </p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
              </div>
            </div>

            {isAdmin && (
              <Button variant="default" size="sm" onClick={() => navigate('/admin')}>
                <Settings className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Admin</span>
              </Button>
            )}

            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Logout</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Already Voted Banner */}
        {hasVoted && (
          <div className="mb-6 bg-green-50 border-2 border-green-500 text-green-900 rounded-lg p-6 flex flex-col items-center justify-center gap-3">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <span className="font-bold text-lg">You have already voted!</span>
            </div>
            <p className="text-sm text-green-700">
              Thank you for participating. You can only vote once. View the results below.
            </p>
          </div>
        )}

        {/* Section Title */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            {hasVoted ? (
              <>
                <Trophy className="h-6 w-6" />
                Voting Results
              </>
            ) : (
              <>
                <Vote className="h-6 w-6" />
                Cast Your Vote
              </>
            )}
          </h2>
          <p className="text-muted-foreground mt-1">
            {hasVoted 
              ? `Total votes: ${totalVotes}` 
              : 'Choose your candidate wisely. You can only vote once!'}
          </p>
        </div>

        {/* Candidates Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {candidates.map((candidate) => {
            const votes = candidate.voteCount

            return (
              <Card 
                key={candidate.id}
                className={`relative ${votedFor === candidate.id ? 'ring-2 ring-primary' : ''}`}
              >
                {votedFor === candidate.id && (
                  <div className="absolute top-2 left-2">
                    <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Your Vote
                    </span>
                  </div>
                )}

                <CardHeader className="text-center pb-2">
                  <Avatar className="h-20 w-20 mx-auto border-2">
                    <AvatarImage src={candidate.photoURL} alt={candidate.name} />
                    <AvatarFallback className="text-xl">
                      {candidate.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle className="mt-3">{candidate.name}</CardTitle>
                  <div className="mt-2">
                    <CardDescription 
                      className={`text-left ${expandedBios[candidate.id] ? '' : 'line-clamp-4'}`}
                    >
                      {candidate.description}
                    </CardDescription>
                    {candidate.description.length > 200 && (
                      <button
                        onClick={() => setExpandedBios(prev => ({
                          ...prev,
                          [candidate.id]: !prev[candidate.id]
                        }))}
                        className="text-xs text-blue-600 hover:underline mt-1"
                      >
                        {expandedBios[candidate.id] ? 'Read less' : 'Read more'}
                      </button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="text-center space-y-4">
                  <a
                    href={candidate.linkedInProfile.startsWith('http') ? candidate.linkedInProfile : `https://${candidate.linkedInProfile}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    View LinkedIn Profile
                  </a>

                  {hasVoted && (
                    <div className="text-sm font-medium">
                      {votes} {votes === 1 ? 'vote' : 'votes'}
                    </div>
                  )}
                </CardContent>

                {!hasVoted ? (
                  <CardFooter>
                    <Button
                      onClick={() => handleVote(candidate.id)}
                      disabled={isVoting !== null}
                      className="w-full"
                    >
                      {isVoting === candidate.id ? (
                        'Recording Vote...'
                      ) : (
                        <>
                          <Vote className="mr-2 h-4 w-4" />
                          Vote for {candidate.name.split(' ')[0]}
                        </>
                      )}
                    </Button>
                  </CardFooter>
                ) : (
                  <CardFooter>
                    <Button
                      disabled
                      variant="outline"
                      className="w-full cursor-not-allowed opacity-60"
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Already Voted
                    </Button>
                  </CardFooter>
                )}
              </Card>
            )
          })}
        </div>
      </main>

      {/* LinkedIn Profile Modal */}
      <LinkedInModal 
        open={showLinkedInModal} 
        onSubmit={handleLinkedInSubmit}
      />
    </div>
  )
}
