import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Activity, CreditCard, DollarSign, Users, FileText, Home, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function VerifierDashboard() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLoans() {
      try {
        const response = await fetch("https://creditsea-assignment-2mxe.onrender.com/loans/loans",{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }); 
        const data = await response.json();
        setLoans(data?.data?.loans);
      } catch (error) {
        console.error("Error fetching loans:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchLoans();
  }, []);

  const handleUpdateStatus = async (loanId, newStatus) => {
    if(newStatus === "approved") {
      return alert("You are not authorized to approve loans.");
    }

    try {
      const response = await fetch(`https://creditsea-assignment-2mxe.onrender.com/loans/loan/verify/${loanId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      const updatedLoan = await response.json();
      setLoans(loans?.map(loan => loan._id === loanId ? { ...loan, status: updatedLoan?.loan?.status } : loan));
    } catch (error) {
      console.error("Error updating loan status:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.reload();
  }

  return (
    <div className="flex h-screen bg-background">
      <div className="w-64 bg-[#0B4619] text-white p-4">
        <div className="flex items-center gap-2 mb-8">
          <Activity className="h-6 w-6" />
          <span className="font-semibold">CREDIT APP</span>
        </div>
        <nav className="space-y-2">
          {[
            { icon: Home, label: "Dashboard" },
            { icon: Users, label: "Borrowers" },
            { icon: CreditCard, label: "Loans" },
            { icon: DollarSign, label: "Payments" },
            { icon: FileText, label: "Reports" },
            { icon: Settings, label: "Settings" },
          ].map((item) => (
            <button
              key={item.label}
              className="flex items-center gap-3 w-full px-3 py-2 text-sm hover:bg-white/10 rounded-lg"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </div>
      
      <div className="flex-1 overflow-auto p-8">
        <div className="grid grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">LOANS</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{loans?.length || "0"}</div>
            </CardContent>
          </Card>
          {/* Additional Cards for Stats */}
          <Button onClick={handleLogout} className=" absolute right-2 flex items-center gap-2">LogOut</Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Applied Loans</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Loan Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {loans?.map((loan) => (
                    <TableRow key={loan?._id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={loan?.avatar || "/placeholder.svg"} />
                            <AvatarFallback>{loan?.fullName[0]}</AvatarFallback>
                          </Avatar>
                          {loan?.fullName}
                        </div>
                      </TableCell>
                      <TableCell>{loan?.purpose}</TableCell>
                      <TableCell>{new Date(loan?.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <select
                          value={loan?.status}
                          onChange={(e) => handleUpdateStatus(loan?._id, e.target.value)}
                          className="border rounded px-2 py-1 text-sm"
                        >
                          <option value="pending">Pending</option>
                          <option value="verified">Verified</option>
                          <option value="rejected">Rejected</option>
                          <option value="approved">Approved</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
