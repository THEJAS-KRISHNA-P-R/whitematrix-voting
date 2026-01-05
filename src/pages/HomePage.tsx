import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Vote, Shield, Users, CheckCircle } from 'lucide-react'

export function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/favicon.png" alt="SimpleVote" className="w-14 h-8" />
            <span className="font-bold text-xl">SimpleVote</span>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Secure Voting Made Simple
          </h1>
          <p className="text-xl text-muted-foreground mb-10">
            A modern voting platform with LinkedIn verification. 
            Ensure every vote counts with verified professional identities.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup">
              <Button size="lg" className="w-full sm:w-auto">
                Start Voting
                <Vote className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mt-16">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Shield className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">LinkedIn Verified</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Every voter is verified through their LinkedIn profile for authentic participation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">One Vote Per Person</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Our system ensures each verified user can only cast one vote per election.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center mb-2 mx-auto">
                  <Users className="h-6 w-6" />
                </div>
                <CardTitle className="text-lg">Transparent Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  See who voted in real-time with full transparency while maintaining vote privacy.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-muted-foreground text-sm">
          <p>&copy; 2026 SimpleVote. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
