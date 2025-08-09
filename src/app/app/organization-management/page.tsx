"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Edit, Eye } from "lucide-react";
import { 
  listOrganizations, 
  createOrganization, 
  getOrganization,
  updateOrganization,
  type Organization,
  type CreateOrganizationRequest,
  type UpdateOrganizationRequest
} from "@/lib/organizationApi";

export default function OrganizationManagementPage() {
  const { user, getAuthHeaders } = useAuth();
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<CreateOrganizationRequest>({
    name: "",
    domain: "",
    logo_url: "",
    subscription_plan: "basic",
    max_users: 50,
  });

  // Check if user is super admin
  useEffect(() => {
    if (user && user.role !== "super_admin") {
      router.push("/app/dashboard");
    }
  }, [user, router]);

  // Show loading if user is not loaded yet
  if (!user) {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (user?.role !== "super_admin") {
    return (
      <div className="p-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              You don't have permission to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await listOrganizations(getAuthHeaders(), currentPage, 20);
      setOrganizations(response.organizations);
      setTotalPages(Math.ceil(response.total / 20));
    } catch (error: any) {
      setError(error.message || "Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "super_admin") {
      fetchOrganizations();
    }
  }, [user, currentPage]);

  const handleCreateOrganization = async () => {
    try {
      setLoading(true);
      await createOrganization(getAuthHeaders(), formData);
      setIsCreateDialogOpen(false);
      setFormData({
        name: "",
        domain: "",
        logo_url: "",
        subscription_plan: "basic",
        max_users: 50,
      });
      fetchOrganizations();
    } catch (error: any) {
      setError(error.message || "Failed to create organization");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateOrganization = async () => {
    if (!selectedOrganization) return;
    
    try {
      setLoading(true);
      const updateData: UpdateOrganizationRequest = {
        name: formData.name,
        domain: formData.domain,
        logo_url: formData.logo_url,
        subscription_plan: formData.subscription_plan,
        max_users: formData.max_users,
      };
      
      await updateOrganization(getAuthHeaders(), selectedOrganization.id, updateData);
      setIsEditDialogOpen(false);
      setSelectedOrganization(null);
      fetchOrganizations();
    } catch (error: any) {
      setError(error.message || "Failed to update organization");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (organization: Organization) => {
    setSelectedOrganization(organization);
    setFormData({
      name: organization.name,
      domain: organization.domain,
      logo_url: organization.logo_url || "",
      subscription_plan: organization.subscription_plan,
      max_users: organization.max_users,
    });
    setIsEditDialogOpen(true);
  };

  const handleView = async (organization: Organization) => {
    try {
      const fullOrganization = await getOrganization(getAuthHeaders(), organization.id);
      setSelectedOrganization(fullOrganization);
      setIsViewDialogOpen(true);
    } catch (error: any) {
      setError(error.message || "Failed to fetch organization details");
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Organization Management</h1>
          <p className="text-muted-foreground">
            Manage organizations and their settings
          </p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Create Organization
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Create New Organization</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Organization Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter organization name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="domain">Domain</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                  placeholder="Enter domain (e.g., example.com)"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logo_url">Logo URL (Optional)</Label>
                <Input
                  id="logo_url"
                  value={formData.logo_url}
                  onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                  placeholder="Enter logo URL"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="subscription_plan">Subscription Plan</Label>
                <Select
                  value={formData.subscription_plan}
                  onValueChange={(value: 'basic' | 'premium' | 'enterprise') =>
                    setFormData({ ...formData, subscription_plan: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="max_users">Max Users</Label>
                <Input
                  id="max_users"
                  type="number"
                  value={formData.max_users}
                  onChange={(e) => setFormData({ ...formData, max_users: parseInt(e.target.value) })}
                  placeholder="Enter maximum number of users"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateOrganization} disabled={loading}>
                {loading ? "Creating..." : "Create Organization"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Organizations</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-destructive">{error}</p>
            </div>
          )}
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrganizations.map((organization) => (
                  <TableRow key={organization.id}>
                    <TableCell className="font-medium">{organization.name}</TableCell>
                    <TableCell>{organization.domain}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{organization.subscription_plan}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          organization.status === "active" ? "default" :
                          organization.status === "inactive" ? "secondary" : "destructive"
                        }
                      >
                        {organization.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{organization.user_count}/{organization.max_users}</TableCell>
                    <TableCell>
                      {new Date(organization.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleView(organization)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(organization)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">Organization Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter organization name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-domain">Domain</Label>
              <Input
                id="edit-domain"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                placeholder="Enter domain (e.g., example.com)"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-logo_url">Logo URL (Optional)</Label>
              <Input
                id="edit-logo_url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="Enter logo URL"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-subscription_plan">Subscription Plan</Label>
              <Select
                value={formData.subscription_plan}
                onValueChange={(value: 'basic' | 'premium' | 'enterprise') =>
                  setFormData({ ...formData, subscription_plan: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic</SelectItem>
                  <SelectItem value="premium">Premium</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="edit-max_users">Max Users</Label>
              <Input
                id="edit-max_users"
                type="number"
                value={formData.max_users}
                onChange={(e) => setFormData({ ...formData, max_users: parseInt(e.target.value) })}
                placeholder="Enter maximum number of users"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateOrganization} disabled={loading}>
              {loading ? "Updating..." : "Update Organization"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Organization Details</DialogTitle>
          </DialogHeader>
          {selectedOrganization && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Name</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrganization.name}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Domain</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrganization.domain}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Subscription Plan</Label>
                  <p className="text-sm text-muted-foreground">
                    <Badge variant="outline">{selectedOrganization.subscription_plan}</Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Status</Label>
                  <p className="text-sm text-muted-foreground">
                    <Badge
                      variant={
                        selectedOrganization.status === "active" ? "default" :
                        selectedOrganization.status === "inactive" ? "secondary" : "destructive"
                      }
                    >
                      {selectedOrganization.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Users</Label>
                  <p className="text-sm text-muted-foreground">
                    {selectedOrganization.user_count}/{selectedOrganization.max_users}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Created</Label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(selectedOrganization.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
              {selectedOrganization.logo_url && (
                <div>
                  <Label className="text-sm font-medium">Logo URL</Label>
                  <p className="text-sm text-muted-foreground">{selectedOrganization.logo_url}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
