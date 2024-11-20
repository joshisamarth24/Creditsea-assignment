import React, { useState } from 'react';
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
// import { useToast } from "@/components/ui/use-toast"
import {
  BellIcon,
  CreditCard,
  Home,
  MessageCircle,
  User,
  Wallet,
} from "lucide-react"
import { useNavigate } from 'react-router-dom';

export default function ApplicationForm() {
 
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    amount: '',
    tenure: '',
    employmentStatus: '',
    purpose: '',
    employmentAddress: '',
    terms: false,
    consent: false
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = 'Please enter a valid loan amount';
    }
    if (!formData.tenure || formData.tenure <= 0) {
      newErrors.tenure = 'Please enter a valid loan tenure';
    }
    if (!formData.employmentStatus.trim()) {
      newErrors.employmentStatus = 'Employment status is required';
    }
    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Reason for loan is required';
    }
    if (!formData.employmentAddress.trim()) {
      newErrors.employmentAddress = 'Employment address is required';
    }
    if (!formData.terms) {
      newErrors.terms = 'You must accept the terms';
    }
    if (!formData.consent) {
      newErrors.consent = 'You must provide consent';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    // Clear error when user starts typing
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const handleCheckboxChange = (id) => {
    setFormData(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
    if (errors[id]) {
      setErrors(prev => ({
        ...prev,
        [id]: undefined
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit", formData);
    
    if (!validateForm()) {
      // toast({
      //   variant: "destructive",
      //   title: "Validation Error",
      //   description: "Please check all required fields"
      // });
      return;
    }

    setIsLoading(true);
    
    try {
      const response = await fetch('https://asdfkjakdsfw.info/loans/loan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Application submission failed');
      }

      const data = await response.json();
      
      // toast({
      //   title: "Application Submitted",
      //   description: "Your loan application has been submitted successfully!"
      // });

      // Reset form
      setFormData({
        fullName: '',
        amount: '',
        tenure: '',
        employmentStatus: '',
        purpose: '',
        employmentAddress: '',
        terms: false,
        consent: false
      });
      navigate('/loans');
      
    } catch (error) {
      // toast({
      //   variant: "destructive",
      //   title: "Error",
      //   description: "Failed to submit application. Please try again."
      // });
      console.error('Submission error:', error);
    } finally {
      setIsLoading(false);
    }
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
      <main className="max-w-4xl mx-auto py-8 px-4">
        <Card className="w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">APPLY FOR A LOAN</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full name as it appears on bank account</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name as it appears on bank account"
                    className={errors.fullName ? "border-red-500" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-red-500 text-sm">{errors.fullName}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanAmount">How much do you need?</Label>
                  <Input
                    id="amount"
                    value={formData.amount}
                    onChange={handleInputChange}
                    placeholder="Enter amount you need"
                    type="number"
                    className={errors.amount ? "border-red-500" : ""}
                  />
                  {errors.amount && (
                    <p className="text-red-500 text-sm">{errors.amount}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="loanTenure">Loan tenure (in months)</Label>
                  <Input
                    id="tenure"
                    value={formData.tenure}
                    onChange={handleInputChange}
                    placeholder="Loan tenure (in months)"
                    type="number"
                    className={errors.tenure ? "border-red-500" : ""}
                  />
                  {errors.tenure && (
                    <p className="text-red-500 text-sm">{errors.tenure}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentStatus">Employment status</Label>
                  <Input
                    id="employmentStatus"
                    value={formData.employmentStatus}
                    onChange={handleInputChange}
                    placeholder="Employment status"
                    className={errors.employmentStatus ? "border-red-500" : ""}
                  />
                  {errors.employmentStatus && (
                    <p className="text-red-500 text-sm">{errors.employmentStatus}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reason">Reason for loan</Label>
                  <Textarea
                    id="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    placeholder="Reason for loan"
                    className={`min-h-[100px] ${errors.purpose ? "border-red-500" : ""}`}
                  />
                  {errors.purpose && (
                    <p className="text-red-500 text-sm">{errors.purpose}</p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employmentAddress">Employment address</Label>
                  <Textarea
                    id="employmentAddress"
                    value={formData.employmentAddress}
                    onChange={handleInputChange}
                    placeholder="Employment address"
                    className={`min-h-[100px] ${errors.employmentAddress ? "border-red-500" : ""}`}
                  />
                  {errors.employmentAddress && (
                    <p className="text-red-500 text-sm">{errors.employmentAddress}</p>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="terms" 
                    checked={formData.terms}
                    onCheckedChange={() => handleCheckboxChange('terms')}
                  />
                  <Label htmlFor="terms" className={`text-sm ${errors.terms ? "text-red-500" : ""}`}>
                    I have read the important information and accept that by completing the application I will be bound by the terms
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="consent" 
                    checked={formData.consent}
                    onCheckedChange={() => handleCheckboxChange('consent')}
                  />
                  <Label htmlFor="consent" className={`text-sm ${errors.consent ? "text-red-500" : ""}`}>
                    Any personal and credit information obtained may be disclosed from time to time to other lenders, credit bureau or other credit reporting agencies
                  </Label>
                </div>
              </div>

              <Button 
                type="submit"
                className="w-full bg-green-800 hover:bg-green-700" 
                size="lg"
                disabled={isLoading}
              >
                {isLoading ? "Submitting..." : "Submit"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}