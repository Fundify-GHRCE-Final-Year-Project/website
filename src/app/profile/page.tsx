"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { currentUserAtom, isUserConnectedAtom } from "@/store/global";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, MapPin, Briefcase, AlertCircle, ExternalLink } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetCurrentUser, useGetUserProjects } from "@/lib/hooks";

export default function ProfilePage() {
  const router = useRouter();
  const [isConnected] = useAtom(isUserConnectedAtom);
  const { user } = useGetCurrentUser();
  const { projects } = useGetUserProjects();

  useEffect(() => {
    console.log(user, isConnected);
  }, [user, isConnected]);

  // Check if user is connected and has user data
  if (!user || !isConnected) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 h-16 w-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <AlertCircle className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle className="text-2xl">
                Wallet Connection Required
              </CardTitle>
              <CardDescription>
                Please connect your wallet to view your profile.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button onClick={() => router.push("/")}>Connect Wallet</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">
              Manage your profile information and preferences.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="h-5 w-5" />
                  <span>Basic Information</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <p className="text-lg">{user.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Country
                  </label>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{user.country}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Role</label>
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-4 w-4 text-muted-foreground" />
                    <span>{user.role}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle>Skills</CardTitle>
                <CardDescription>
                  Your technical and soft skills
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {user.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Experiences */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Experience</CardTitle>
                <CardDescription>
                  Your work experience and background
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {user.experiences.map((experience, index) => (
                    <div key={index} className="border-l-2 border-muted pl-4">
                      <h4 className="font-semibold">{experience.role}</h4>
                      <p className="text-muted-foreground">{experience.company}</p>
                      <p className="text-sm text-muted-foreground">{experience.duration}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Your professional and social media profiles
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">LinkedIn</span>
                    <a 
                      href={user.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <span className="text-sm">View Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">X (Twitter)</span>
                    <a 
                      href={user.x} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <span className="text-sm">View Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">GitHub</span>
                    <a 
                      href={user.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                    >
                      <span className="text-sm">View Profile</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Wallet Info */}
            <Card>
              <CardHeader>
                <CardTitle>Wallet Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Wallet Address
                    </div>
                    <div className="font-mono text-sm break-all">
                      {user.wallet}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">
                      Projects Created
                    </div>
                    <div className="text-lg font-semibold">
                      {projects?.length || 0}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}