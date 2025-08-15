import React, { useState, useEffect } from "react";
import { ContractHistoryItem, ContractHistoryResponse } from "../../../../lib/contractApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { 
  FileText, 
  FileCheck, 
  Calendar, 
  Users, 
  Building2,
  Clock,
  Eye,
  Download,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Trash2,
  MoreVertical,
  Loader2,
  FileDown
} from "lucide-react";

interface ContractHistoryListProps {
  onContractSelect: (contract: ContractHistoryItem) => void;
  onDeleteContract: (contractId: string) => Promise<void>;
  onRefresh: () => void;
  loading: boolean;
  history: ContractHistoryResponse | null;
  error: string | null;
}

const getTemplateIcon = (type: string) => {
  switch (type) {
    case 'nda':
      return <FileCheck className="w-5 h-5" />;
    case 'service_agreement':
      return <FileText className="w-5 h-5" />;
    case 'employment_contract':
      return <Users className="w-5 h-5" />;
    case 'partnership_agreement':
      return <Building2 className="w-5 h-5" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
};

const getTemplateColor = (type: string) => {
  switch (type) {
    case 'nda':
      return 'bg-blue-500/10 text-blue-600 border-blue-200';
    case 'service_agreement':
      return 'bg-green-500/10 text-green-600 border-green-200';
    case 'employment_contract':
      return 'bg-purple-500/10 text-purple-600 border-purple-200';
    case 'partnership_agreement':
      return 'bg-orange-500/10 text-orange-600 border-orange-200';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'completed':
      return 'bg-green-500/10 text-green-600 border-green-200';
    case 'processing':
      return 'bg-yellow-500/10 text-yellow-600 border-yellow-200';
    case 'failed':
      return 'bg-red-500/10 text-red-600 border-red-200';
    default:
      return 'bg-gray-500/10 text-gray-600 border-gray-200';
  }
};

export default function ContractHistoryList({
  onContractSelect,
  onDeleteContract,
  onRefresh,
  loading,
  history,
  error
}: ContractHistoryListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [deletingContractId, setDeletingContractId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [contractToDelete, setContractToDelete] = useState<ContractHistoryItem | null>(null);
  const pageSize = 10;

  const totalPages = history ? Math.ceil(history.total_count / pageSize) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleDeleteClick = (contract: ContractHistoryItem, event: React.MouseEvent) => {
    event.stopPropagation();
    setContractToDelete(contract);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!contractToDelete) return;
    
    setDeletingContractId(contractToDelete.contract_id);
    try {
      await onDeleteContract(contractToDelete.contract_id);
      setShowDeleteDialog(false);
      setContractToDelete(null);
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setDeletingContractId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteDialog(false);
    setContractToDelete(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Contract History</h2>
            <p className="text-muted-foreground">View your previously generated contracts</p>
          </div>
          <Skeleton className="h-10 w-24" />
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-lg" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-48" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Contract History</h2>
            <p className="text-muted-foreground">View your previously generated contracts</p>
          </div>
          <Button
            variant="outline"
            onClick={onRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">Error Loading History</h3>
            <p className="text-muted-foreground text-center mb-4">
              {error}
            </p>
            <Button onClick={onRefresh} variant="outline">
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!history || history.contracts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Contract History</h2>
            <p className="text-muted-foreground">View your previously generated contracts</p>
          </div>
          <Button
            variant="outline"
            onClick={onRefresh}
            className="flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>
        
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="w-12 h-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No Contracts Found</h3>
            <p className="text-muted-foreground text-center">
              You haven't generated any contracts yet. Start by creating your first contract.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold mb-2">Contract History</h2>
          <p className="text-muted-foreground">
            View your previously generated contracts ({history.total_count} total)
          </p>
        </div>
        <Button
          variant="outline"
          onClick={onRefresh}
          className="flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </Button>
      </div>
      
      <div className="space-y-4">
        {history.contracts.map((contract) => (
          <Card 
            key={contract.contract_id} 
            className="hover:shadow-md transition-all duration-200 cursor-pointer group border-2 hover:border-primary/20"
            onClick={() => onContractSelect(contract)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg border ${getTemplateColor(contract.template_type)}`}>
                    {getTemplateIcon(contract.template_type)}
                  </div>
                  <div>
                    <CardTitle className="text-lg">{contract.title}</CardTitle>
                    <p className="text-sm text-muted-foreground capitalize">
                      {contract.template_type.replace('_', ' ')}
                    </p>
                  </div>
                </div>
                                 <div className="flex items-center gap-2">
                   <Badge 
                     variant="outline" 
                     className={getStatusColor(contract.status)}
                   >
                     {contract.status}
                   </Badge>
                   
                   <DropdownMenu>
                     <DropdownMenuTrigger asChild>
                       <Button
                         variant="ghost"
                         size="sm"
                         className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                         onClick={(e) => e.stopPropagation()}
                       >
                         <MoreVertical className="w-4 h-4" />
                       </Button>
                     </DropdownMenuTrigger>
                     <DropdownMenuContent align="end">
                       <DropdownMenuItem onClick={() => onContractSelect(contract)}>
                         <Eye className="w-4 h-4 mr-2" />
                         View Details
                       </DropdownMenuItem>
                       <DropdownMenuSeparator />
                       <DropdownMenuItem 
                         onClick={(e) => handleDeleteClick(contract, e)}
                         className="text-red-600 focus:text-red-600"
                         disabled={deletingContractId === contract.contract_id}
                       >
                         {deletingContractId === contract.contract_id ? (
                           <>
                             <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                             Deleting...
                           </>
                         ) : (
                           <>
                             <Trash2 className="w-4 h-4 mr-2" />
                             Delete Contract
                           </>
                         )}
                       </DropdownMenuItem>
                     </DropdownMenuContent>
                   </DropdownMenu>
                 </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {contract.description}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>Created: {formatDate(contract.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>Updated: {formatDate(contract.updated_at)}</span>
                </div>
              </div>
              
              <div className="flex gap-2">
                <Badge variant="secondary" className="text-xs">
                  {contract.template_type.replace('_', ' ')}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  ID: {contract.contract_id.slice(0, 8)}...
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, history.total_count)} of {history.total_count} contracts
          </p>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1;
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => handlePageChange(page)}
                    className="w-8 h-8 p-0"
                  >
                    {page}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
                 </div>
       )}

       {/* Delete Confirmation Dialog */}
       <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
         <AlertDialogContent>
           <AlertDialogHeader>
             <AlertDialogTitle>Delete Contract</AlertDialogTitle>
             <AlertDialogDescription>
               Are you sure you want to delete "{contractToDelete?.title}"? This action cannot be undone.
             </AlertDialogDescription>
           </AlertDialogHeader>
           <AlertDialogFooter>
             <AlertDialogCancel onClick={handleCancelDelete}>Cancel</AlertDialogCancel>
             <AlertDialogAction 
               onClick={handleConfirmDelete}
               className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
               disabled={deletingContractId === contractToDelete?.contract_id}
             >
               {deletingContractId === contractToDelete?.contract_id ? (
                 <>
                   <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                   Deleting...
                 </>
               ) : (
                 'Delete Contract'
               )}
             </AlertDialogAction>
           </AlertDialogFooter>
         </AlertDialogContent>
       </AlertDialog>
     </div>
   );
 } 