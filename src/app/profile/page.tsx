// src/app/profile/page.tsx
'use client'

import { useAtom } from 'jotai'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { currentUserAtom, isUserConnectedAtom } from '@/store/global'
import { useGetUserProjects } from '@/lib/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  User, 
  Wallet, 
  MapPin, 
  Briefcase, 
  Github, 
  Linkedin, 
  Twitter,
  Mail,
  Calendar,
  TrendingUp,
  FolderOpen,
  DollarSign,
  Edit,
  ExternalLink,
  Loader2,
  AlertCircle
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter();
  const [isConnected] = useAtom(isUserConnectedAtom);
  const [currentUser] = useAtom(currentUserAtom);
  const { projects, isLoading, error } = useGetUserProjects();

  // Debug logging
  useEffect(() => {
    console.log('Profile Debug:', {
      isConnected,
      currentUser,
      userWallet: currentUser?.wallet,
      projects,
      isLoading,
      error
    });
  }, [isConnected, currentUser, projects, isLoading, error]);

  useEffect(() => {
    if (!isConnected || !currentUser) {
      router.push('/');
    }
  }, [isConnected, currentUser, router]);

  const formatAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const calculateProjectStats = () => {
    if (!projects || projects.length === 0) {
      return {
        totalProjects: 0,
        totalFunded: 0,
        totalGoal: 0,
        fundingPercentage: 0
      };
    }

    const totalFunded = projects.reduce((sum, project) => {
      try {
        return sum + (parseFloat(project.funded) / Math.pow(10, 18));
      } catch {
        return sum;
      }
    }, 0);

    const totalGoal = projects.reduce((sum, project) => {
      try {
        return sum + (parseFloat(project.goal) / Math.pow(10, 18));
      } catch {
        return sum;
      }
    }, 0);

    return {
      totalProjects: projects.length,
      totalFunded,
      totalGoal,
      fundingPercentage: totalGoal > 0 ? (totalFunded / totalGoal) * 100 : 0
    };
  };

  const stats = calculateProjectStats();

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Wallet className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h2 className="text-xl font-semibold mb-2">No User Data</h2>
            <p className="text-muted-foreground">Please connect your wallet to view profile.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Profile</h1>
          <p className="text-muted-foreground">
            Manage your account and view your activity on Fundiy.
          </p>
        </div>
        <Button onClick={() => router.push('/profile/edit')}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Information */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-12 w-12 text-primary" />
              </div>
              <CardTitle className="text-xl">
                {currentUser.name || 'Anonymous User'}
              </CardTitle>
              <CardDescription>
                {formatAddress(currentUser.wallet)}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {currentUser.country && (
                <div className="flex items-center space-x-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{currentUser.country}</span>
                </div>
              )}
              
              {currentUser.role && (
                <div className="flex items-center space-x-3">
                  <Briefcase className="h-4 w-4 text-muted-foreground" />
                  <Badge variant="secondary">{currentUser.role}</Badge>
                </div>
              )}

              {/* Skills */}
              {currentUser.skills && currentUser.skills.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {currentUser.skills.map((skill, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Social Links */}
              <div className="space-y-2">
                {currentUser.github && (
                  <a 
                    href={currentUser.github} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-sm hover:text-primary transition-colors"
                  >
                    <Github className="h-4 w-4" />
                    <span>GitHub</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                
                {currentUser.linkedin && (
                  <a 
                    href={currentUser.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-sm hover:text-primary transition-colors"
                  >
                    <Linkedin className="h-4 w-4" />
                    <span>LinkedIn</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                
                {currentUser.x && (
                  <a 
                    href={currentUser.x} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-sm hover:text-primary transition-colors"
                  >
                    <Twitter className="h-4 w-4" />
                    <span>X (Twitter)</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity and Stats */}
        <div className="lg:col-span-2 space-y-6">
          {/* Debug Info Card - Remove this in production */}
          {/* <Card className="border-orange-200 bg-orange-50/50">
            <CardHeader>
              <CardTitle className="text-sm text-orange-800">Debug Info (Remove in production)</CardTitle>
            </CardHeader>
            <CardContent className="text-xs space-y-1 text-orange-700">
              <div>User Wallet: {currentUser?.wallet || 'Not found'}</div>
              <div>Projects Loading: {isLoading ? 'Yes' : 'No'}</div>
              <div>Projects Count: {projects?.length || 0}</div>
              <div>Error: {error || 'None'}</div>
              <div>Projects Data: {JSON.stringify(projects?.slice(0, 2), null, 2)}</div>
            </CardContent>
          </Card> */}

          {/* Project Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
                <FolderOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalProjects}</div>
                <p className="text-xs text-muted-foreground">
                  Active projects created
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Funds Raised</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalFunded.toFixed(3)} ETH</div>
                <p className="text-xs text-muted-foreground">
                  Total funding received
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.fundingPercentage.toFixed(1)}%</div>
                <p className="text-xs text-muted-foreground">
                  Average funding progress
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Projects */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Projects</CardTitle>
              <CardDescription>
                Your latest project activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading your projects...</span>
                </div>
              ) : error ? (
                <div className="flex items-center justify-center py-8 text-red-500">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  <span>Error loading projects: {error}</span>
                </div>
              ) : projects && projects.length > 0 ? (
                <div className="space-y-4">
                  {projects.slice(0, 3).map((project) => (
                    <div 
                      key={`${project.owner}-${project.index}`}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">
                          {project.title || `Project #${project.index}`}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {project.description ? 
                            project.description.slice(0, 60) + '...' : 
                            'No description available'
                          }
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">
                          {(parseFloat(project.funded || '0') / Math.pow(10, 18)).toFixed(3)} ETH
                        </p>
                        <p className="text-xs text-muted-foreground">
                          of {(parseFloat(project.goal || '0') / Math.pow(10, 18)).toFixed(3)} ETH
                        </p>
                      </div>
                    </div>
                  ))}
                  
                  {projects.length > 3 && (
                    <Button 
                      variant="outline" 
                      className="w-full mt-4"
                      onClick={() => router.push('/my-projects')}
                    >
                      View All Projects ({projects.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-muted-foreground mb-4">
                    You haven't created any projects yet.
                  </p>
                  <Button onClick={() => router.push('/publish')}>
                    Create Your First Project
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/publish')}
                  className="h-12"
                >
                  <FolderOpen className="h-4 w-4 mr-2" />
                  Create New Project
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/my-projects')}
                  className="h-12"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  View My Projects
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/invested-projects')}
                  className="h-12"
                >
                  <Wallet className="h-4 w-4 mr-2" />
                  My Investments
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => router.push('/projects')}
                  className="h-12"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Browse Projects
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}