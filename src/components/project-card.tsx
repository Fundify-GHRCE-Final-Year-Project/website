'use client'

import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  Calendar, 
  Users, 
  Target, 
  TrendingUp,
  Clock,
  CheckCircle,
  XCircle,
  ExternalLink
} from 'lucide-react'
import { Project } from '@/types/global'
import { 
  calculateFundingPercentage, 
  calculateRemainingFunding, 
  formatEthAmount, 
  formatPercentage,
  getProjectStatus,
  calculateDaysRemaining
} from '@/lib/calculations'

interface ProjectCardProps {
  project: Project
  viewMode: 'grid' | 'list'
}

export function ProjectCard({ project, viewMode }: ProjectCardProps) {
  const fundingPercentage = calculateFundingPercentage(project)
  const remainingFunding = calculateRemainingFunding(project)
  const status = getProjectStatus(project)
  const daysRemaining = calculateDaysRemaining(project)

  const getStatusBadge = () => {
    switch (status) {
      case 'active':
        return <Badge variant="default" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">Active</Badge>
      case 'funded':
        return <Badge variant="default" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">Funded</Badge>
      case 'ended':
        return <Badge variant="destructive">Ended</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = () => {
    switch (status) {
      case 'active':
        return <Clock className="h-4 w-4 text-green-600" />
      case 'funded':
        return <CheckCircle className="h-4 w-4 text-blue-600" />
      case 'ended':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  if (viewMode === 'list') {
    return (
      <Card className="card-hover">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex-1 space-y-2">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-xl mb-2">
                    <Link 
                      href={`/project/${project.owner}-${project.index}`}
                      className="hover:text-primary transition-colors"
                    >
                      {project.title}
                    </Link>
                  </CardTitle>
                  <CardDescription className="text-sm line-clamp-2">
                    {project.description}
                  </CardDescription>
                </div>
                <div className="ml-4 flex items-center space-x-2">
                  {getStatusBadge()}
                  {getStatusIcon()}
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Target className="h-4 w-4" />
                  <span>Goal: {formatEthAmount(project.goal)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Funded: {formatEthAmount(project.funded)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="h-4 w-4" />
                  <span>{project.members.length} member{project.members.length !== 1 ? 's' : ''}</span>
                </div>
                {status === 'active' && (
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-4 w-4" />
                    <span>{daysRemaining} days left</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="lg:w-64 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{formatPercentage(fundingPercentage)}</span>
                </div>
                <Progress value={fundingPercentage} className="h-2" />
                <div className="text-sm text-muted-foreground">
                  {remainingFunding > 0 
                    ? `${formatEthAmount(remainingFunding)} needed`
                    : 'Goal reached!'
                  }
                </div>
              </div>
              
              <Link href={`/project/${project.owner}-${project.index}`}>
                <Button className="w-full">
                  View Details
                  <ExternalLink className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Grid view
  return (
    <Card className="card-hover h-full flex flex-col">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between mb-2">
          <CardTitle className="text-lg line-clamp-2">
            <Link 
              href={`/project/${project.owner}-${project.index}`}
              className="hover:text-primary transition-colors"
            >
              {project.title}
            </Link>
          </CardTitle>
          <div className="flex items-center space-x-1 ml-2">
            {getStatusBadge()}
            {getStatusIcon()}
          </div>
        </div>
        <CardDescription className="line-clamp-3">
          {project.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{formatPercentage(fundingPercentage)}</span>
          </div>
          <Progress value={fundingPercentage} className="h-2" />
          <div className="text-sm text-muted-foreground">
            {remainingFunding > 0 
              ? `${formatEthAmount(remainingFunding)} needed`
              : 'Goal reached!'
            }
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="text-muted-foreground">Goal</div>
            <div className="font-medium">{formatEthAmount(project.goal)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Funded</div>
            <div className="font-medium">{formatEthAmount(project.funded)}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Members</div>
            <div className="font-medium">{project.members.length}</div>
          </div>
          <div className="space-y-1">
            <div className="text-muted-foreground">Milestones</div>
            <div className="font-medium">{project.milestones}</div>
          </div>
        </div>
        
        {status === 'active' && (
          <div className="flex items-center space-x-1 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{daysRemaining} days left</span>
          </div>
        )}
        
        <Link href={`/project/${project.owner}-${project.index}`} className="block">
          <Button className="w-full">
            View Details
            <ExternalLink className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  )
} 