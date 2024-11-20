import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BellIcon,
  Home,
  MessageCircle,
  User,
  Wallet,
  CreditCard,
  Search,
  Filter,
  ArrowLeft,
  ArrowRight,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function LoanDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [balance, setBalance] = useState(0);
  const [loans, setLoans] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortField, setSortField] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('borrow');


  // Fetch loans with pagination, sorting, and filtering
  useEffect(() => {
    const fetchLoans = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(
          `https://asdfkjakdsfw.info/loans/userLoans/${user?._id}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
        
        if (!response.ok) throw new Error('Failed to fetch loans');
        
        const data = await response.json();
        setLoans(data.loans);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error('Error fetching loans:', error);
        // toast({
        //   variant: "destructive",
        //   title: "Error",
        //   description: "Failed to fetch loans"
        // });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLoans();
  }, [currentPage, sortField, sortOrder, statusFilter, searchQuery]);

  // Handle search with debounce
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  // Handle sort
  const handleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
    setCurrentPage(1);
  };

  // Handle filter
  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  // Handle pagination
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Handle tab change
  const handleTabChange = (value) => {
    setActiveTab(value);
    // Additional logic for each tab can be added here
  };

  // Get status button style
  const getStatusStyle = (status) => {
    const styles = {
      Active: "bg-yellow-500 hover:bg-yellow-600",
      Approved: "bg-green-500 hover:bg-green-600 text-white",
      Pending: "bg-red-500 hover:bg-red-600 text-white",
      Processing: "bg-blue-500 hover:bg-blue-600 text-white"
    };
    return styles[status] || "";
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.reload();
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <span className="text-green-800 font-bold text-lg">CREDIT APP</span>
              <div className="hidden md:block ml-10">
                <div className="flex items-center space-x-4">
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Home className="h-4 w-4" />
                    Home
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Wallet className="h-4 w-4" />
                    Payments
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Budget
                  </Button>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4" />
                    Card
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <BellIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <MessageCircle className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button onClick={handleLogout} size="icon">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto py-8 px-4">
        <div className="space-y-6">
          {/* Balance Card */}
          <Card className="p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Wallet className="h-6 w-6 text-green-800" />
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">BALANCE</div>
                  <div className="text-3xl font-bold">
                    {new Intl.NumberFormat('en-US', {
                      style: 'currency',
                      currency: 'USD'
                    }).format(balance)}
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => navigate('/application')}
                className="bg-green-800 hover:bg-green-700"
              >
                Get A Loan
              </Button>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="borrow">Borrow Cash</TabsTrigger>
                <TabsTrigger value="transact">Transact</TabsTrigger>
                <TabsTrigger value="deposit">Deposit Cash</TabsTrigger>
              </TabsList>
            </Tabs>
          </Card>

          {/* Search and Filters */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input 
                className="pl-10"
                placeholder="Search for loans"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleStatusFilter('all')}>
                    All Status
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('active')}>
                    Active
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('approved')}>
                    Approved
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('pending')}>
                    Pending
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleStatusFilter('processing')}>
                    Processing
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">Sort</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleSort('amount')}>
                    Amount {sortField === 'amount' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('date')}>
                    Date {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('status')}>
                    Status {sortField === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Loans Table */}
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Loan Officer</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date Applied</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : loans.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      No loans found
                    </TableCell>
                  </TableRow>
                ) : (
                  loans.map((loan, index) => (
                    <TableRow key={loan.id || index}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={loan.officerImage || "/placeholder.svg"} />
                            <AvatarFallback>{loan.fullName|| "JD"}</AvatarFallback>
                          </Avatar>
                          <span>{loan.fullName || "John Doe"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Intl.NumberFormat('en-US', {
                          style: 'currency',
                          currency: 'USD'
                        }).format(loan.amount)}
                      </TableCell>
                      <TableCell>
                        {new Date(loan.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant={loan.status === "Active" ? "default" : "outline"}
                          className={getStatusStyle(loan.status)}
                        >
                          {loan.status}
                        </Button>
                      </TableCell>\
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
            
            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t">
              <div className="text-sm text-muted-foreground">
                Page {currentPage} of {totalPages}
              </div>
              <div className="flex items-center gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || isLoading}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages || isLoading}
                >
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}