"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Slider } from "@/components/ui/slider"
import { ThemeToggle } from "@/components/ThemeToggle"
import { 
  FileText, 
  Users, 
  Shield, 
  Scale, 
  Gavel, 
  BookOpen, 
  AlertCircle, 
  CheckCircle,
  Clock,
  User
} from "lucide-react"

export default function DesignSystemPage() {
  return (
    <div className="container-legal min-h-screen py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-legal-title text-legal-primary">My Jurist Design System</h1>
          <p className="text-legal-subheader">Professional law-themed UI components</p>
        </div>
        <ThemeToggle />
      </div>

      <div className="grid-legal md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Typography Section */}
        <Card className="document-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Typography
            </CardTitle>
            <CardDescription>Text styles for legal documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <h1 className="text-legal-title">Legal Title</h1>
            <h2 className="text-legal-heading">Legal Heading</h2>
            <h3 className="text-legal-subheading">Legal Subheading</h3>
            <p className="text-legal-body">Legal body text with proper line height and spacing for readability.</p>
            <p className="text-legal-caption">Legal caption text for supplementary information.</p>
          </CardContent>
        </Card>

        {/* Buttons Section */}
        <Card className="document-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5" />
              Buttons
            </CardTitle>
            <CardDescription>Action buttons for legal workflows</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="destructive">Delete</Button>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
            </div>
          </CardContent>
        </Card>

        {/* Form Elements */}
        <Card className="document-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Form Elements
            </CardTitle>
            <CardDescription>Input fields for legal forms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Client Name</Label>
              <Input id="name" placeholder="Enter client name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="case">Case Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select case type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="civil">Civil Case</SelectItem>
                  <SelectItem value="criminal">Criminal Case</SelectItem>
                  <SelectItem value="family">Family Law</SelectItem>
                  <SelectItem value="corporate">Corporate Law</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="notes">Case Notes</Label>
              <Textarea id="notes" placeholder="Enter case notes..." />
            </div>
          </CardContent>
        </Card>

        {/* Status Indicators */}
        <Card className="document-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Status Indicators
            </CardTitle>
            <CardDescription>Case and document status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge className="status-pending">Pending Review</Badge>
              <Badge className="status-approved">Approved</Badge>
              <Badge className="status-rejected">Rejected</Badge>
              <Badge className="status-review">Under Review</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Case Progress</span>
                <span className="text-sm text-muted-foreground">75%</span>
              </div>
              <Progress value={75} className="w-full" />
            </div>
          </CardContent>
        </Card>

        {/* User Interface */}
        <Card className="document-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              User Interface
            </CardTitle>
            <CardDescription>User profiles and interactions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar>
                <AvatarImage src="/images/gaurav.jpeg" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">John Doe</p>
                <p className="text-xs text-muted-foreground">Senior Partner</p>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Switch id="notifications" />
                <Label htmlFor="notifications">Email notifications</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">I agree to the terms</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Display */}
        <Card className="document-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Data Display
            </CardTitle>
            <CardDescription>Case information and metrics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>
              <TabsContent value="overview" className="space-y-2">
                <p className="text-sm">Case summary and key metrics</p>
              </TabsContent>
              <TabsContent value="details" className="space-y-2">
                <p className="text-sm">Detailed case information</p>
              </TabsContent>
            </Tabs>
            <Accordion type="single" collapsible>
              <AccordionItem value="item-1">
                <AccordionTrigger>Case History</AccordionTrigger>
                <AccordionContent>
                  Detailed timeline of case events and milestones.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Alerts and Notifications */}
        <Card className="document-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Alerts & Notifications
            </CardTitle>
            <CardDescription>Important messages and warnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Case has been successfully submitted for review.
              </AlertDescription>
            </Alert>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Missing required documentation. Please upload all files.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Interactive Elements */}
        <Card className="document-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Interactive Elements
            </CardTitle>
            <CardDescription>Sliders and radio groups</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Priority Level</Label>
              <Slider defaultValue={[50]} max={100} step={1} className="w-full" />
            </div>
            <RadioGroup defaultValue="option-one">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <Label htmlFor="option-one">High Priority</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <Label htmlFor="option-two">Medium Priority</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-three" id="option-three" />
                <Label htmlFor="option-three">Low Priority</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Color Palette */}
        <Card className="document-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Color Palette
            </CardTitle>
            <CardDescription>Law-themed color system</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <div className="h-8 bg-primary rounded"></div>
                <p className="text-xs">Primary</p>
              </div>
              <div className="space-y-1">
                <div className="h-8 bg-secondary rounded"></div>
                <p className="text-xs">Secondary</p>
              </div>
              <div className="space-y-1">
                <div className="h-8 bg-accent rounded"></div>
                <p className="text-xs">Accent</p>
              </div>
              <div className="space-y-1">
                <div className="h-8 bg-muted rounded"></div>
                <p className="text-xs">Muted</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="mt-12 pt-8 border-t">
        <p className="text-center text-legal-caption">
          My Jurist Design System - Professional Legal UI Components
        </p>
      </div>
    </div>
  )
} 