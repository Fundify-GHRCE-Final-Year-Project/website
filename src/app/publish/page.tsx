'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAtom } from 'jotai'
import { currentUserAtom, successMessageAtom, errorMessageAtom } from '@/store/global'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Rocket, 
  Target, 
  Users, 
  Calendar,
  Plus,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react'
import { ProjectSchema } from '@/types/global'

export default function PublishProjectPage() {
  const router = useRouter()
  const [currentUser] = useAtom(currentUserAtom)
  const [, setSuccessMessage] = useAtom(successMessageAtom)
  const [, setErrorMessage] = useAtom(errorMessageAtom)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    goal: '',
    milestones: '2',
    members: ['']
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleMemberChange = (index: number, value: string) => {
    const newMembers = [...formData.members]
    newMembers[index] = value
    setFormData(prev => ({ ...prev, members: newMembers }))
  }

  const addMember = () => {
    if (formData.members.length < 5) {
      setFormData(prev => ({ ...prev, members: [...prev.members, ''] }))
    }
  }

  const removeMember = (index: number) => {
    if (formData.members.length > 1) {
      const newMembers = formData.members.filter((_, i) => i !== index)
      setFormData(prev => ({ ...prev, members: newMembers }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Project description is required'
    }

    if (!formData.goal || parseFloat(formData.goal) <= 0) {
      newErrors.goal = 'Valid funding goal is required'
    }

    if (!formData.milestones || parseInt(formData.milestones) < 1 || parseInt(formData.milestones) > 20) {
      newErrors.milestones = 'Milestones must be between 1 and 20'
    }

    // Validate member addresses
    formData.members.forEach((member, index) => {
      if (member.trim() && !member.match(/^0x[a-fA-F0-9]{40}$/)) {
        newErrors[`member-${index}`] = 'Invalid wallet address'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!currentUser) {
      setErrorMessage('Please connect your wallet first')
      return
    }

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Create project data
      const projectData = {
  owner: String(currentUser.wallet || '').trim(),
  members: formData.members.filter(m => m.trim()).map(m => m.trim()),
  index: Math.floor(Math.random() * 10000) + 1,
  goal: parseFloat(formData.goal),
  milestones: parseInt(formData.milestones),
  funded: 0,
  released: 0,
  ended: false,
  title: formData.title.trim(),
  description: formData.description.trim()
}


      // Validate with Zod schema
      ProjectSchema.parse(projectData)

      setSuccessMessage('Project published successfully!')
      router.push('/my-projects')
    } catch (error) {
      console.error('Error publishing project:', error)
      setErrorMessage('Failed to publish project. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="container mx-auto px-4 py-8">
        
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">Wallet Connection Required</CardTitle>
              <CardDescription>
                Please connect your wallet to publish a project.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => router.push('/')}>
                Connect Wallet
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <>
    <div className="container mx-auto px-4 py-8">
      
      <div className="max-w-4xl mx-auto ">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Publish Your Project</h1>
          <p className="text-muted-foreground">
            Share your innovative idea with the world and start raising funds with cryptocurrency.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Rocket className="h-5 w-5" />
                <span>Basic Information</span>
              </CardTitle>
              <CardDescription>
                Provide the essential details about your project.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium mb-2">
                  Project Title *
                </label>
                <Input
                  id="title"
                  placeholder="Enter your project title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={errors.title ? 'border-red-500' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-red-500 mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium mb-2">
                  Project Description *
                </label>
                <Textarea
                  id="description"
                  placeholder="Describe your project, its goals, and what makes it unique"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-sm text-red-500 mt-1">{errors.description}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Funding Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Target className="h-5 w-5" />
                <span>Funding Details</span>
              </CardTitle>
              <CardDescription>
                Set your funding goal and milestone structure.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label htmlFor="goal" className="block text-sm font-medium mb-2">
                  Funding Goal (ETH) *
                </label>
                <Input
                  id="goal"
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="Enter funding goal in ETH"
                  value={formData.goal}
                  onChange={(e) => handleInputChange('goal', e.target.value)}
                  className={errors.goal ? 'border-red-500' : ''}
                />
                {errors.goal && (
                  <p className="text-sm text-red-500 mt-1">{errors.goal}</p>
                )}
              </div>

              <div>
                <label htmlFor="milestones" className="block text-sm font-medium mb-2">
                  Number of Milestones *
                </label>
                <Input
                  id="milestones"
                  type="number"
                  min="1"
                  max="20"
                  placeholder="Number of milestones (1-20)"
                  value={formData.milestones}
                  onChange={(e) => handleInputChange('milestones', e.target.value)}
                  className={errors.milestones ? 'border-red-500' : ''}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Funds will be released at each milestone. For example, 2 milestones = 50% and 100%, 3 milestones = 33%, 66%, and 100%.
                </p>
                {errors.milestones && (
                  <p className="text-sm text-red-500 mt-1">{errors.milestones}</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Team Members */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Team Members</span>
              </CardTitle>
              <CardDescription>
                Add team members by their wallet addresses (optional).
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.members.map((member, index) => (
                <div key={index} className="flex space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter wallet address (optional)"
                      value={member}
                      onChange={(e) => handleMemberChange(index, e.target.value)}
                      className={errors[`member-${index}`] ? 'border-red-500' : ''}
                    />
                    {errors[`member-${index}`] && (
                      <p className="text-sm text-red-500 mt-1">{errors[`member-${index}`]}</p>
                    )}
                  </div>
                  {formData.members.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeMember(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              
              {formData.members.length < 5 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addMember}
                  className="flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Team Member</span>
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center space-x-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                <>
                  <Rocket className="h-4 w-4" />
                  <span>Publish Project</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
    </>
  )
}