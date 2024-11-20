import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EyeIcon, EyeOffIcon } from 'lucide-react'
// import { useToast } from "@/components/ui/use-toast"
import toast from 'react-hot-toast'


export default function AuthForm() {
  const navigate = useNavigate()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  
  // Form states
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })
  
  const [signupForm, setSignupForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const [errors, setErrors] = useState({
    login: {},
    signup: {}
  })

  const togglePasswordVisibility = () => setShowPassword(!showPassword)

  // Validation functions
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    return password.length >= 6
  }

  const validateSignupForm = () => {
    const newErrors = {}
    
    if (!signupForm.name.trim()) {
      newErrors.fullName = 'Full name is required'
    }
    
    if (!validateEmail(signupForm.email)) {
      newErrors.email = 'Invalid email address'
    }
    
    if (!validatePassword(signupForm.password)) {
      newErrors.password = 'Password must be at least 8 characters'
    }
    
    if (signupForm.password !== signupForm.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    setErrors({ ...errors, signup: newErrors })
    return Object.keys(newErrors).length === 0
  }

  const validateLoginForm = () => {
    const newErrors = {}
    
    if (!validateEmail(loginForm.email)) {
      newErrors.email = 'Invalid email address'
    }
    
    if (!loginForm.password) {
      newErrors.password = 'Password is required'
    }

    setErrors({ ...errors, login: newErrors })
    return Object.keys(newErrors).length === 0
  }

  // API calls
  const handleLogin = async (e) => {
    e.preventDefault()
    if (!validateLoginForm()) return

    setIsLoading(true)
    try {
      const response = await fetch('https://asdfkjakdsfw.info/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Login failed')
      }

      // Store the token
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      // Determine route based on user role
      const userRole = data.user.role
      const routes = {
        'admin': '/admin',
        'verifier': '/verifier',
        'user': '/loans'
      }
      
      navigate(routes[userRole] || '/application')
      // toast({
      //   title: "Success!",
      //   description: "You have successfully logged in.",
      //   variant: "success",
      // })

      
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: error.message || "An error occurred during login",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!validateSignupForm()) return

    setIsLoading(true)
    try {
      const response = await fetch('https://asdfkjakdsfw.info/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({...signupForm,role:'user'})
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Signup failed')
      }

      // toast({
      //   title: "Success!",
      //   description: "Account created successfully. Please log in.",
      //   variant: "success",
      // })
      
      // Reset form and switch to login tab
      setSignupForm({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      window.location.reload()
    } catch (error) {
      // toast({
      //   title: "Error",
      //   description: error.message || "An error occurred during signup",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Welcome to Credit App</CardTitle>
          <CardDescription className="text-center">Sign up or log in to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            <TabsContent value="login">
              <form onSubmit={handleLogin}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      placeholder="Enter your email" 
                      type="email" 
                      required
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className={errors.login.email ? "border-red-500" : ""}
                    />
                    {errors.login.email && (
                      <p className="text-sm text-red-500">{errors.login.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        placeholder="Enter your password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className={errors.login.password ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    {errors.login.password && (
                      <p className="text-sm text-red-500">{errors.login.password}</p>
                    )}
                  </div>
                </div>
                <Button 
                  className="w-full mt-6 bg-green-800 hover:bg-green-700" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Log In"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignup}>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">Full Name</Label>
                    <Input 
                      id="signup-name" 
                      placeholder="Enter your full name" 
                      required
                      value={signupForm.name}
                      onChange={(e) => setSignupForm({ ...signupForm, name: e.target.value })}
                      className={errors.signup.name ? "border-red-500" : ""}
                    />
                    {errors.signup.name && (
                      <p className="text-sm text-red-500">{errors.signup.name}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">Email</Label>
                    <Input 
                      id="signup-email" 
                      placeholder="Enter your email" 
                      type="email" 
                      required
                      value={signupForm.email}
                      onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                      className={errors.signup.email ? "border-red-500" : ""}
                    />
                    {errors.signup.email && (
                      <p className="text-sm text-red-500">{errors.signup.email}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">Password</Label>
                    <div className="relative">
                      <Input
                        id="signup-password"
                        placeholder="Create a password"
                        type={showPassword ? "text" : "password"}
                        required
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className={errors.signup.password ? "border-red-500" : ""}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={togglePasswordVisibility}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4 text-gray-500" />
                        ) : (
                          <EyeIcon className="h-4 w-4 text-gray-500" />
                        )}
                      </Button>
                    </div>
                    {errors.signup.password && (
                      <p className="text-sm text-red-500">{errors.signup.password}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                    <Input
                      id="signup-confirm-password"
                      placeholder="Confirm your password"
                      type="password"
                      required
                      value={signupForm.confirmPassword}
                      onChange={(e) => setSignupForm({ ...signupForm, confirmPassword: e.target.value })}
                      className={errors.signup.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.signup.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.signup.confirmPassword}</p>
                    )}
                  </div>
                </div>
                <Button 
                  className="w-full mt-6 bg-green-800 hover:bg-green-700" 
                  type="submit"
                  disabled={isLoading}
                >
                  {isLoading ? "Loading..." : "Sign Up"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">
            By continuing, you agree to our{" "}
            <a href="#" className="underline">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="underline">
              Privacy Policy
            </a>
            .
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}