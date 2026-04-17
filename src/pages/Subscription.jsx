"use client"

import { useState, useEffect } from "react"
import { FaCheckCircle, FaCrown, FaSpinner, FaArrowRight, FaRegCreditCard } from "react-icons/fa";

import { userInfo as getUserInfo } from "../utils/token";

import { useNavigate } from "react-router-dom"

export default function Subscription() {
    const [products, setProducts] = useState([]);
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    const [processingId, setProcessingId] = useState(null)
    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    
    



    useEffect(() => {
        fetchSubscriptionProducts();
        getUserInfo().then(user => {
            setUserData(user);
        }); 
    }, [])

    const fetchSubscriptionProducts = async () => {
        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/products/subscription-products`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    },
            })
            const data = await response.json();
            if (!response.ok) {
                setError(true);
                throw new Error("Failed to fetch subscription products")
            }
            
            setError(false);
            setProducts(data?.products || [])
        } catch (err) {
            console.error("Error fetching subscription products:", err)
            setError(true);
            setError("Failed to load subscription plans. Please try again later.")
        } finally {
        setLoading(false)
        }
    }

    const handleSubscribe = async (priceId) => {
        try {
            if (!token) { 
                navigate("/login")
            }
        setProcessingId(priceId)
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/payment/checkout-session`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ priceId: priceId }),
        })  
            
        if (!response.ok) {
            throw new Error("Failed to create checkout session")
        }

        const { url } = await response.json()

        // Redirect to Stripe checkout
        window.location.href = url
        } catch (err) {
            console.error("Error creating checkout session:", err);
            setError("Failed to process subscription. Please try again later.");
        } finally {
        setProcessingId(null)
        }
    }

    if (loading) {
        return (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
            <FaSpinner className="animate-spin text-4xl text-blue-500 mb-4" />
            <p className="text-gray-600">Loading subscription plans...</p>
        </div>
        )
    }

    if (error) {
        return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">{error}</p>
            <button
            onClick={fetchSubscriptionProducts}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
            Try Again
            </button>
        </div>
        )
    }

    return (
        <div className="py-12 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Choose Your Subscription Plan</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
            Select the plan that works best for you and start boosting your reputation today.
            </p>
        </div>

        {products.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg">
            <p className="text-gray-500">No subscription plans available at the moment.</p>
            </div>
        ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
                <div
                key={product.id}
                className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-shadow duration-300"
                >
                <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
                    <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-gray-800">{product.name}</h2>
                    {product.name.includes("Pro") && <FaCrown className="text-yellow-500 text-2xl" />}
                    </div>
                    <p className="text-gray-600 mb-4">{product.description}</p>
                    <div className="flex items-baseline mb-2">
                    <span className="text-4xl font-bold text-gray-900">${product.amount}</span>
                    <span className="text-gray-500 ml-2">/{product.interval}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-6">Billed {product.interval}ly</p>
                </div>

                <div className="p-6">
                    <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3">What's included:</h3>
                    <ul className="space-y-3">
                        <li className="flex items-start">
                        <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">
                          {product.name.includes("Enterprise") ? "Unlimited " : `${product.tokens}`} tokens per {product.interval} (5 tokens / Report)
                        </span>
                        </li>
                        <li className="flex items-start">
                        <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">Full access to all features</span>
                        </li>
                        <li className="flex items-start">
                        <FaCheckCircle className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                        <span className="text-gray-600">Priority support</span>
                        </li>
                    </ul>
                    </div>

                    <button
                        onClick={() => handleSubscribe(product.priceId)}
                        disabled={userData?.productId === product.id}
                        className={`w-full py-3 px-4 rounded-lg flex items-center justify-center font-medium transition-colors ${
                            product.name.includes("Pro")
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        } ${userData?.productId === product.id ? "opacity-50 cursor-not-allowed" : ""}`}
                        >
                        {processingId === product.priceId ? (
                            <>
                            <FaSpinner className="animate-spin mr-2" />
                            Processing...
                            </>
                        ) : (
                            <>
                            <FaRegCreditCard className="mr-2" />
                                Subscribe Now
                            <FaArrowRight className="ml-2" />
                            </>
                        )}
                    </button>
                </div>
                </div>
            ))}
            </div>
        )}
        </div>
    )
}
