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
import { Plus, Search, Edit, Eye, Trash2, Users, UserPlus, ChevronDown, ChevronRight } from "lucide-react";
import { 
  listOrganizations, 
  createOrganization, 
  getOrganization,
  updateOrganization,
  deleteOrganization,
  listOrganizationUsers,
  createUser,
  updateUser,
  deleteUser,
  type Organization,
  type CreateOrganizationRequest,
  type UpdateOrganizationRequest,
  type OrganizationUser,
  type OrganizationUsersResponse,
  type CreateUserRequest,
  type UpdateUserRequest,
  type User
} from "@/lib/organizationApi";

// Mobile Organization Card Component
const MobileOrganizationCard: React.FC<{
  organization: Organization;
  onView: (org: Organization) => void;
  onEdit: (org: Organization) => void;
  onDelete: (org: Organization) => void;
  onViewUsers: (org: Organization) => void;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
}> = ({ organization, onView, onEdit, onDelete, onViewUsers, canEdit, canDelete, canManageUsers }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100 truncate">
              {organization.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {organization.domain}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="ml-2"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Button>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {organization.subscription_plan}
          </Badge>
          <Badge
            variant={
              organization.status === "active" ? "default" :
              organization.status === "inactive" ? "secondary" : "destructive"
            }
            className="text-xs"
          >
            {organization.status}
          </Badge>
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          Users: {organization.user_count}/{organization.max_users}
        </div>

        {isExpanded && (
          <div className="space-y-3 pt-3 border-t">
            <div className="flex flex-col space-y-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onView(organization)}
                className="w-full justify-start"
              >
                <Eye className="w-4 h-4 mr-2" />
                View Details
              </Button>
              
              {canManageUsers && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewUsers(organization)}
                  className="w-full justify-start"
                >
                  <Users className="w-4 h-4 mr-2" />
                  View Users
                </Button>
              )}
              
              {canEdit && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(organization)}
                  className="w-full justify-start"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
              
              {canDelete && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(organization)}
                  className="w-full justify-start text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

// Mobile Users List Component
const MobileUsersList: React.FC<{
  users: OrganizationUser[];
  onEditUser: (user: User) => void;
  onDeleteUser: (user: User) => void;
}> = ({ users, onEditUser, onDeleteUser }) => {
  return (
    <div className="space-y-3">
      {users.map((user) => (
        <Card key={user.id} className="p-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-gray-100 text-sm truncate">
                {user.full_name}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 truncate">
                {user.email}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">
                  {user.role}
                </Badge>
                <Badge
                  variant={user.is_active ? "default" : "secondary"}
                  className="text-xs"
                >
                  {user.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
            <div className="flex flex-col space-y-1 ml-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEditUser(user)}
                className="h-8 px-2"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDeleteUser(user)}
                className="h-8 px-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

// Mobile View Component
const MobileOrganizationManagement: React.FC<{
  user: any;
  organizations: Organization[];
  loading: boolean;
  error: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateOrganization: () => void;
  onView: (org: Organization) => void;
  onEdit: (org: Organization) => void;
  onDelete: (org: Organization) => void;
  onViewUsers: (org: Organization) => void;
  canCreateOrganization: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
}> = ({
  user,
  organizations,
  loading,
  error,
  searchTerm,
  onSearchChange,
  onCreateOrganization,
  onView,
  onEdit,
  onDelete,
  onViewUsers,
  canCreateOrganization,
  canEdit,
  canDelete,
  canManageUsers
}) => {
  return (
    <div className="p-3 space-y-4">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {user?.role === "org_admin" ? "Organization Management" : "Organization Management"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {user?.role === "org_admin" 
            ? "Manage users in your organization" 
            : "Manage organizations and their settings"
          }
        </p>
      </div>

      {/* Search and Create */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search organizations..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 w-full"
          />
        </div>
        
        {canCreateOrganization && (
          <Button onClick={onCreateOrganization} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Create Organization
          </Button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}

      {/* Organizations List */}
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="space-y-2">
          {organizations.map((organization) => (
            <MobileOrganizationCard
              key={organization.id}
              organization={organization}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              onViewUsers={onViewUsers}
              canEdit={canEdit}
              canDelete={canDelete}
              canManageUsers={canManageUsers}
            />
          ))}
          
          {organizations.length === 0 && (
            <div className="text-center py-8">
              <p className="text-muted-foreground text-sm">No organizations found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Desktop View Component
const DesktopOrganizationManagement: React.FC<{
  user: any;
  organizations: Organization[];
  loading: boolean;
  error: string;
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onCreateOrganization: () => void;
  onView: (org: Organization) => void;
  onEdit: (org: Organization) => void;
  onDelete: (org: Organization) => void;
  onViewUsers: (org: Organization) => void;
  canCreateOrganization: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canManageUsers: boolean;
}> = ({
  user,
  organizations,
  loading,
  error,
  searchTerm,
  onSearchChange,
  onCreateOrganization,
  onView,
  onEdit,
  onDelete,
  onViewUsers,
  canCreateOrganization,
  canEdit,
  canDelete,
  canManageUsers
}) => {
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">
            {user?.role === "org_admin" ? "Organization Management" : "Organization Management"}
          </h1>
          <p className="text-muted-foreground">
            {user?.role === "org_admin" 
              ? "Manage users in your organization" 
              : "Manage organizations and their settings"
            }
          </p>
        </div>
        {canCreateOrganization && (
          <Button onClick={onCreateOrganization}>
            <Plus className="w-4 h-4 mr-2" />
            Create Organization
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>
              {user?.role === "org_admin" ? "Your Organization" : "Organizations"}
            </CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search organizations..."
                  value={searchTerm}
                  onChange={(e) => onSearchChange(e.target.value)}
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
                {organizations.map((organization) => (
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
                          onClick={() => onView(organization)}
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        {canManageUsers && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onViewUsers(organization)}
                            title="View Users"
                          >
                            <Users className="w-4 h-4" />
                          </Button>
                        )}
                        {canEdit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onEdit(organization)}
                            title="Edit Organization"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        {canDelete && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onDelete(organization)}
                            title="Delete Organization"
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isUsersDialogOpen, setIsUsersDialogOpen] = useState(false);
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false);
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false);
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false);
  const [selectedOrganization, setSelectedOrganization] = useState<Organization | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [organizationUsers, setOrganizationUsers] = useState<OrganizationUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState("");
  const [formData, setFormData] = useState<CreateOrganizationRequest>({
    name: "",
    domain: "",
    logo_url: "",
    subscription_plan: "basic",
    max_users: 50,
  });
  const [userFormData, setUserFormData] = useState<CreateUserRequest>({
    email: "",
    full_name: "",
    password: "",
    role: "org_user",
    organization_id: "",
  });
  const [userUpdateData, setUserUpdateData] = useState<UpdateUserRequest>({
    full_name: "",
    role: "org_user",
    is_active: true,
    organization_id: "",
  });

  // Check if user has appropriate permissions
  useEffect(() => {
    if (user && !["super_admin", "org_admin"].includes(user.role)) {
              router.push("/app/home");
    }
  }, [user, router]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      if (user?.role === "super_admin") {
        // Super admin can see all organizations
        const response = await listOrganizations(getAuthHeaders(), currentPage, 20);
        setOrganizations(response.organizations);
        setTotalPages(Math.ceil(response.total / 20));
      } else if (user?.role === "org_admin" && user?.organization_id) {
        // Org admin can only see their own organization
        const response = await getOrganization(getAuthHeaders(), user.organization_id);
        setOrganizations([response]);
        setTotalPages(1);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch organizations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "super_admin" || user?.role === "org_admin") {
      fetchOrganizations();
    }
  }, [user, currentPage]);

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

  // Check permissions after user is loaded
  if (!["super_admin", "org_admin"].includes(user?.role || "")) {
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

  const handleDelete = (organization: Organization) => {
    setSelectedOrganization(organization);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedOrganization) return;
    
    try {
      setLoading(true);
      await deleteOrganization(getAuthHeaders(), selectedOrganization.id);
      setIsDeleteDialogOpen(false);
      setSelectedOrganization(null);
      fetchOrganizations();
    } catch (error: any) {
      setError(error.message || "Failed to delete organization");
    } finally {
      setLoading(false);
    }
  };

  const handleViewUsers = async (organization: Organization) => {
    try {
      setUsersLoading(true);
      setUsersError("");
      const response = await listOrganizationUsers(getAuthHeaders(), organization.id, 1, 50);
      setOrganizationUsers(response.users);
      setSelectedOrganization(organization);
      setIsUsersDialogOpen(true);
    } catch (error: any) {
      setUsersError(error.message || "Failed to fetch organization users");
    } finally {
      setUsersLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      setLoading(true);
      // For org_admin users, automatically set the organization_id to their organization
      const userDataToCreate = {
        ...userFormData,
        organization_id: user?.role === "org_admin" ? user.organization_id : userFormData.organization_id
      };
      await createUser(getAuthHeaders(), userDataToCreate);
      setIsCreateUserDialogOpen(false);
      setUserFormData({
        email: "",
        full_name: "",
        password: "",
        role: "org_user",
        organization_id: "",
      });
      // Refresh the users list if we're viewing users
      if (selectedOrganization) {
        const response = await listOrganizationUsers(getAuthHeaders(), selectedOrganization.id, 1, 50);
        setOrganizationUsers(response.users);
      }
    } catch (error: any) {
      setError(error.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setUserUpdateData({
      full_name: user.full_name,
      role: user.role,
      is_active: user.is_active,
      organization_id: user.organization_id,
    });
    setIsEditUserDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      // For org_admin users, automatically set the organization_id to their organization
      const userDataToUpdate = {
        ...userUpdateData,
        organization_id: user?.role === "org_admin" ? user.organization_id : userUpdateData.organization_id
      };
      await updateUser(getAuthHeaders(), selectedUser.id, userDataToUpdate);
      setIsEditUserDialogOpen(false);
      setSelectedUser(null);
      // Refresh the users list if we're viewing users
      if (selectedOrganization) {
        const response = await listOrganizationUsers(getAuthHeaders(), selectedOrganization.id, 1, 50);
        setOrganizationUsers(response.users);
      }
    } catch (error: any) {
      setError(error.message || "Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = (user: User) => {
    setSelectedUser(user);
    setIsDeleteUserDialogOpen(true);
  };

  const handleConfirmDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      await deleteUser(getAuthHeaders(), selectedUser.id);
      setIsDeleteUserDialogOpen(false);
      setSelectedUser(null);
      // Refresh the users list if we're viewing users
      if (selectedOrganization) {
        const response = await listOrganizationUsers(getAuthHeaders(), selectedOrganization.id, 1, 50);
        setOrganizationUsers(response.users);
      }
    } catch (error: any) {
      setError(error.message || "Failed to delete user");
    } finally {
      setLoading(false);
    }
  };

  const filteredOrganizations = organizations.filter(org =>
    org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    org.domain.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Check if user can perform certain actions
  const canCreateOrganization = Boolean(user?.role === "super_admin");
  const canEditOrganization = Boolean(user?.role === "super_admin" || (user?.role === "org_admin" && Boolean(user?.organization_id)));
  const canDeleteOrganization = Boolean(user?.role === "super_admin");
  const canManageUsers = Boolean(user?.role === "super_admin" || user?.role === "org_admin");

  // Determine if we should show mobile view
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Render mobile or desktop view
  if (isMobile) {
    return (
      <>
        <MobileOrganizationManagement
          user={user}
          organizations={filteredOrganizations}
          loading={loading}
          error={error}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onCreateOrganization={() => setIsCreateDialogOpen(true)}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onViewUsers={handleViewUsers}
          canCreateOrganization={canCreateOrganization}
          canEdit={canEditOrganization}
          canDelete={canDeleteOrganization}
          canManageUsers={canManageUsers}
        />
        
        {/* Mobile Dialogs */}
        {renderDialogs()}
      </>
    );
  }

  return (
    <>
      <DesktopOrganizationManagement
        user={user}
        organizations={filteredOrganizations}
        loading={loading}
        error={error}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onCreateOrganization={() => setIsCreateDialogOpen(true)}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onViewUsers={handleViewUsers}
        canCreateOrganization={canCreateOrganization}
        canEdit={canEditOrganization}
        canDelete={canDeleteOrganization}
        canManageUsers={canManageUsers}
      />
      
      {/* Desktop Dialogs */}
      {renderDialogs()}
    </>
  );

  // Helper function to render all dialogs
  function renderDialogs() {
    return (
      <>
        {/* Create Organization Dialog */}
        {canCreateOrganization && (
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="sm:max-w-[425px] max-w-[95vw] mx-4 p-4 sm:p-6">
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
        )}

        {/* Edit Dialog */}
        {canEditOrganization && (
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[425px] max-w-[95vw] mx-4 p-4 sm:p-6">
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
        )}

        {/* View Dialog */}
        <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
          <DialogContent className="sm:max-w-[600px] max-w-[95vw] mx-4 p-4 sm:p-6">
            <DialogHeader>
              <DialogTitle>Organization Details</DialogTitle>
            </DialogHeader>
            {selectedOrganization && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

        {/* Delete Confirmation Dialog */}
        {canDeleteOrganization && (
          <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
            <DialogContent className="sm:max-w-[425px] max-w-[95vw] mx-4 p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle>Delete Organization</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive font-medium">Warning: This action cannot be undone!</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Deleting this organization will permanently remove all associated data, including:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                    <li>All organization users</li>
                    <li>All organization data</li>
                    <li>All associated documents and files</li>
                    <li>All organization settings</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete <strong>{selectedOrganization?.name}</strong>?
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleConfirmDelete} 
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete Organization"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Users Dialog */}
        {canManageUsers && (
          <Dialog open={isUsersDialogOpen} onOpenChange={setIsUsersDialogOpen}>
            <DialogContent className="sm:max-w-[800px] max-w-[95vw] mx-4 max-h-[80vh] overflow-y-auto p-4 sm:p-6">
              <DialogHeader>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                  <DialogTitle>
                    Users in {selectedOrganization?.name}
                  </DialogTitle>
                  <Button
                    onClick={() => {
                      setUserFormData({
                        email: "",
                        full_name: "",
                        password: "",
                        role: "org_user",
                        organization_id: selectedOrganization?.id || "",
                      });
                      setIsCreateUserDialogOpen(true);
                    }}
                    className="w-full sm:w-auto"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Add User
                  </Button>
                </div>
              </DialogHeader>
              <div className="py-4">
                {usersError && (
                  <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                    <p className="text-destructive">{usersError}</p>
                  </div>
                )}
                
                {usersLoading ? (
                  <div className="flex justify-center items-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    {/* Mobile Users List */}
                    <div className="block sm:hidden">
                      <MobileUsersList
                        users={organizationUsers}
                        onEditUser={handleEditUser}
                        onDeleteUser={handleDeleteUser}
                      />
                    </div>
                    
                    {/* Desktop Users Table */}
                    <div className="hidden sm:block">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Login</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {organizationUsers.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell className="font-medium">{user.full_name}</TableCell>
                              <TableCell>{user.email}</TableCell>
                              <TableCell>
                                <Badge variant="outline">{user.role}</Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={user.is_active ? "default" : "secondary"}
                                >
                                  {user.is_active ? "Active" : "Inactive"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {user.last_login_at 
                                  ? new Date(user.last_login_at).toLocaleDateString()
                                  : "Never"
                                }
                              </TableCell>
                              <TableCell>
                                {new Date(user.created_at).toLocaleDateString()}
                              </TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleEditUser(user)}
                                    title="Edit User"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleDeleteUser(user)}
                                    title="Delete User"
                                    className="text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </>
                )}
                
                {!usersLoading && organizationUsers.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No users found in this organization.</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Create User Dialog */}
        {canManageUsers && (
          <Dialog open={isCreateUserDialogOpen} onOpenChange={setIsCreateUserDialogOpen}>
            <DialogContent className="sm:max-w-[425px] max-w-[95vw] mx-4 p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle>Create New User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="user-email">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    placeholder="Enter user email"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-full-name">Full Name</Label>
                  <Input
                    id="user-full-name"
                    value={userFormData.full_name}
                    onChange={(e) => setUserFormData({ ...userFormData, full_name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-password">Password</Label>
                  <Input
                    id="user-password"
                    type="password"
                    value={userFormData.password}
                    onChange={(e) => setUserFormData({ ...userFormData, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="user-role">Role</Label>
                  <Select
                    value={userFormData.role}
                    onValueChange={(value: 'super_admin' | 'org_admin' | 'org_user') =>
                      setUserFormData({ ...userFormData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org_user">Organization User</SelectItem>
                      <SelectItem value="org_admin">Organization Admin</SelectItem>
                      {user?.role === "super_admin" && (
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {user?.role === "super_admin" && (
                  <div className="grid gap-2">
                    <Label htmlFor="user-organization">Organization</Label>
                    <Select
                      value={userFormData.organization_id}
                      onValueChange={(value) =>
                        setUserFormData({ ...userFormData, organization_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsCreateUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateUser} disabled={loading}>
                  {loading ? "Creating..." : "Create User"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Edit User Dialog */}
        {canManageUsers && (
          <Dialog open={isEditUserDialogOpen} onOpenChange={setIsEditUserDialogOpen}>
            <DialogContent className="sm:max-w-[425px] max-w-[95vw] mx-4 p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="edit-user-full-name">Full Name</Label>
                  <Input
                    id="edit-user-full-name"
                    value={userUpdateData.full_name}
                    onChange={(e) => setUserUpdateData({ ...userUpdateData, full_name: e.target.value })}
                    placeholder="Enter full name"
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="edit-user-role">Role</Label>
                  <Select
                    value={userUpdateData.role}
                    onValueChange={(value: 'super_admin' | 'org_admin' | 'org_user') =>
                      setUserUpdateData({ ...userUpdateData, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="org_user">Organization User</SelectItem>
                      <SelectItem value="org_admin">Organization Admin</SelectItem>
                      {user?.role === "super_admin" && (
                        <SelectItem value="super_admin">Super Admin</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>
                {user?.role === "super_admin" && (
                  <div className="grid gap-2">
                    <Label htmlFor="edit-user-organization">Organization</Label>
                    <Select
                      value={userUpdateData.organization_id}
                      onValueChange={(value) =>
                        setUserUpdateData({ ...userUpdateData, organization_id: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select organization" />
                      </SelectTrigger>
                      <SelectContent>
                        {organizations.map((org) => (
                          <SelectItem key={org.id} value={org.id}>
                            {org.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="grid gap-2">
                  <Label htmlFor="edit-user-status">Status</Label>
                  <Select
                    value={userUpdateData.is_active ? "true" : "false"}
                    onValueChange={(value) =>
                      setUserUpdateData({ ...userUpdateData, is_active: value === "true" })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="true">Active</SelectItem>
                      <SelectItem value="false">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsEditUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUpdateUser} disabled={loading}>
                  {loading ? "Updating..." : "Update User"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}

        {/* Delete User Confirmation Dialog */}
        {canManageUsers && (
          <Dialog open={isDeleteUserDialogOpen} onOpenChange={setIsDeleteUserDialogOpen}>
            <DialogContent className="sm:max-w-[425px] max-w-[95vw] mx-4 p-4 sm:p-6">
              <DialogHeader>
                <DialogTitle>Delete User</DialogTitle>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive font-medium">Warning: This action cannot be undone!</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Deleting this user will permanently remove all associated data, including:
                  </p>
                  <ul className="text-sm text-muted-foreground mt-2 list-disc list-inside">
                    <li>All user data</li>
                    <li>All user documents and files</li>
                    <li>All user settings and preferences</li>
                    <li>All user activity history</li>
                  </ul>
                </div>
                <p className="text-sm text-muted-foreground">
                  Are you sure you want to delete <strong>{selectedUser?.full_name}</strong> ({selectedUser?.email})?
                </p>
              </div>
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setIsDeleteUserDialogOpen(false)}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleConfirmDeleteUser} 
                  disabled={loading}
                >
                  {loading ? "Deleting..." : "Delete User"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </>
    );
  }
}
