import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "sonner";
import { CountrySelect, StateSelect, CitySelect } from "react-country-state-city";
import "react-country-state-city/dist/react-country-state-city.css";
import PhoneInput from "react-phone-number-input";
import { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import "./CheckoutSection.css";
import OrderPlacedSection from "../orders/OrderPlacedSection";
import { orderService, paymentService } from "../../api/services";

export default function CheckoutSection() {
  const navigate = useNavigate();
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  // Generate idempotency key once when component mounts
  const [idempotencyKey] = useState(() => uuidv4());

  // Form state
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    shipping_address: "",
    shipping_city: "",
    shipping_state: "",
    shipping_postal_code: "",
    shipping_country: "AE",
    notes: "",
  });

  // Country/State/City selections (for react-country-state-city)
  const [selectedCountry, setSelectedCountry] = useState("AE");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  
  // Phone country (separate from shipping country, but syncs when shipping country changes)
  // Must be ISO code string (e.g., "AE", "IN", "US") for react-phone-number-input
  const [phoneCountry, setPhoneCountry] = useState("AE");

  // Field-level validation errors
  const [fieldErrors, setFieldErrors] = useState({});
  const [touchedFields, setTouchedFields] = useState({});

  // Payment method state
  const [paymentMethod, setPaymentMethod] = useState("stripe");

  // UI state
  const [showOrderPlaced, setShowOrderPlaced] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [order, setOrder] = useState(null);
  
  // Animation state
  const [isCheckedOut, setIsCheckedOut] = useState(false);
  const [showCheckmark, setShowCheckmark] = useState(false);

  // Pre-fill form with user data
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        firstName: user.firstname || user.firstName || prev.firstName,
        lastName: user.lastname || user.lastName || prev.lastName,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  // Validation rules
  const validateField = (name, value) => {
    let error = "";

    switch (name) {
      case "firstName":
        if (!value || value.trim().length === 0) {
          error = "First name is required";
        } else if (value.trim().length < 2) {
          error = "First name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          error = "First name can only contain letters, spaces, hyphens, and apostrophes";
        }
        break;

      case "lastName":
        if (!value || value.trim().length === 0) {
          error = "Last name is required";
        } else if (value.trim().length < 2) {
          error = "Last name must be at least 2 characters";
        } else if (!/^[a-zA-Z\s'-]+$/.test(value.trim())) {
          error = "Last name can only contain letters, spaces, hyphens, and apostrophes";
        }
        break;

      case "email":
        if (!value || value.trim().length === 0) {
          error = "Email address is required";
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(value.trim())) {
            error = "Please enter a valid email address";
          }
        }
        break;

      case "phone":
        if (!value || value.trim().length === 0) {
          error = "Phone number is required";
        } else {
          // Use the library's validation - it automatically handles country-specific validation
          // Ensure countryForValidation is always a string ISO code
          let countryForValidation = phoneCountry || "AE";
          
          // Ensure it's a string (not a number)
          if (typeof countryForValidation !== "string") {
            countryForValidation = String(countryForValidation);
            // If it's still a number, use fallback
            if (!isNaN(countryForValidation)) {
              countryForValidation = "AE";
            }
          }
          
          if (!isValidPhoneNumber(value, countryForValidation)) {
            // Get country name for better error message
            const countryNames = {
              AE: "UAE",
              IN: "India",
              US: "United States",
              GB: "United Kingdom",
              CA: "Canada",
              AU: "Australia",
              SA: "Saudi Arabia",
              PK: "Pakistan",
              BD: "Bangladesh"
            };
            const countryName = countryNames[countryForValidation] || countryForValidation;
            error = `Please enter a valid ${countryName} phone number`;
          }
        }
        break;

      case "shipping_address":
        if (!value || value.trim().length === 0) {
          error = "Shipping address is required";
        } else if (value.trim().length < 10) {
          error = "Address must be at least 10 characters";
        }
        break;

      case "shipping_state":
        if (!value || value.trim().length === 0) {
          error = selectedCountry === "AE" ? "Emirate is required" : "State is required";
        }
        break;

      case "shipping_city":
        if (!value || value.trim().length === 0) {
          error = "City is required";
        }
        break;

      case "shipping_postal_code":
        if (!value || value.trim().length === 0) {
          error = "Postal code is required";
        } else {
          // UAE postal codes are typically 5 digits, but some countries may vary
          const postalRegex = /^\d{4,6}$/;
          if (!postalRegex.test(value.trim())) {
            error = "Postal code must be 4-6 digits";
          }
        }
        break;

      case "shipping_country":
        if (!value) {
          error = "Country is required";
        }
        break;

      default:
        break;
    }

    return error;
  };

  // Validate entire form
  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Validate all required fields
    Object.keys(formData).forEach((field) => {
      if (field !== "notes") {
        // notes is optional
        const error = validateField(field, formData[field]);
        if (error) {
          errors[field] = error;
          isValid = false;
        }
      }
    });

    setFieldErrors(errors);
    return isValid;
  };

  // Handle input change with validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Don't trim on input change - preserve spaces for address fields
    // Only trim when validating or submitting
    const processedValue = value;
    
    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));

    // Mark field as touched
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    // Validate field in real-time if it's been touched
    // Use trimmed value for validation but keep original in formData
    if (touchedFields[name] || fieldErrors[name]) {
      const valueForValidation = name === "phone" ? value : value.trim();
      const error = validateField(name, valueForValidation);
      setFieldErrors((prev) => ({
        ...prev,
        [name]: error || undefined,
      }));
    }

    // Clear general error when user starts typing
    if (error) setError(null);
  };

  // Map country IDs (from react-country-state-city) to ISO codes (for react-phone-number-input)
  const getCountryIsoCode = (countryId) => {
    // Comprehensive mapping of country IDs to ISO codes
    const countryIdToIso = {
      1: "US",    101: "IN",  231: "AE",  232: "GB",  38: "CA",   13: "AU",
      191: "SA",  162: "PK",  18: "BD",   14: "AT",   15: "AZ",   16: "BS",
      17: "BH",   19: "BY",   20: "BE",   21: "BZ",   22: "BJ",   23: "BM",
      24: "BT",   25: "BO",   26: "BA",   27: "BW",   28: "BR",   29: "BN",
      30: "BG",   31: "BF",   32: "BI",   33: "KH",   34: "CM",   35: "CV",
      36: "KY",   37: "CF",   39: "TD",   40: "CL",   41: "CN",   42: "CX",
      43: "CC",   44: "CO",   45: "KM",   46: "CG",   47: "CK",   48: "CR",
      49: "HR",   50: "CU",   51: "CW",   52: "CY",   53: "CZ",   54: "CD",
      55: "DK",   56: "DJ",   57: "DM",   58: "DO",   59: "TL",   60: "EC",
      61: "EG",   62: "SV",   63: "GQ",   64: "ER",   65: "EE",   66: "ET",
      67: "FK",   68: "FO",   69: "FJ",   70: "FI",   71: "FR",   72: "PF",
      73: "GA",   74: "GM",   75: "GE",   76: "DE",   77: "GH",   78: "GI",
      79: "GR",   80: "GL",   81: "GD",   82: "GU",   83: "GT",   84: "GG",
      85: "GN",   86: "GW",   87: "GY",   88: "HT",   89: "HN",   90: "HK",
      91: "HU",   92: "IS",   93: "ID",   94: "IR",   95: "IQ",   96: "IE",
      97: "IM",   98: "IL",   99: "IT",   100: "CI",  102: "JP",  103: "JE",
      104: "JO",  105: "KZ",  106: "KE",  107: "KI",  108: "XK",  109: "KW",
      110: "KG",  111: "LA",  112: "LV",  113: "LB",  114: "LS",  115: "LR",
      116: "LY",  117: "LI",  118: "LT",  119: "LU",  120: "MO",  121: "MK",
      122: "MG",  123: "MW",  124: "MY",  125: "MV",  126: "ML",  127: "MT",
      128: "MH",  129: "MR",  130: "MU",  131: "YT",  132: "MX",  133: "FM",
      134: "MD",  135: "MC",  136: "MN",  137: "ME",  138: "MS",  139: "MA",
      140: "MZ",  141: "MM",  142: "NA",  143: "NR",  144: "NP",  145: "NL",
      146: "NC",  147: "NZ",  148: "NI",  149: "NE",  150: "NG",  151: "NU",
      152: "KP",  153: "MP",  154: "NO",  155: "OM",  156: "PK",  157: "PW",
      158: "PS",  159: "PA",  160: "PG",  161: "PY",  163: "PE",  164: "PH",
      165: "PN",  166: "PL",  167: "PT",  168: "PR",  169: "QA",  170: "RE",
      171: "RO",  172: "RU",  173: "RW",  174: "BL",  175: "SH",  176: "KN",
      177: "LC",  178: "MF",  179: "PM",  180: "VC",  181: "WS",  182: "SM",
      183: "ST",  184: "SA",  185: "SN",  186: "RS",  187: "SC",  188: "SL",
      189: "SG",  190: "SX",  192: "SB",  193: "SO",  194: "ZA",  195: "KR",
      196: "SS",  197: "ES",  198: "LK",  199: "SD",  200: "SR",  201: "SJ",
      202: "SZ",  203: "SE",  204: "CH",  205: "SY",  206: "TW",  207: "TJ",
      208: "TZ",  209: "TH",  210: "TG",  211: "TK",  212: "TO",  213: "TT",
      214: "TN",  215: "TR",  216: "TM",  217: "TC",  218: "TV",  219: "VI",
      220: "UG",  221: "UA",  222: "AE",  223: "GB",  224: "US",  225: "UY",
      226: "UZ",  227: "VU",  228: "VA",  229: "VE",  230: "VN",  233: "EH",
      234: "YE",  235: "ZM",  236: "ZW",
    };
    
    return countryIdToIso[countryId] || "AE";
  };

  // Handle country change
  const handleCountryChange = (country) => {
    if (!country) return;
    // react-country-state-city returns numeric ID, but we need ISO code for PhoneInput
    const countryId = country?.id;
    
    // Get ISO code using mapping function
    const countryIsoCode = getCountryIsoCode(countryId);
    
    const countryName = country?.name || "";
    
    setSelectedCountry(countryId); // Keep ID for StateSelect/CitySelect which need numeric ID
    setSelectedState("");
    setSelectedCity("");
    setFormData((prev) => ({
      ...prev,
      shipping_country: countryIsoCode || countryName || String(countryId), // Store ISO code or name
      shipping_state: "",
      shipping_city: "",
    }));
    
    // Sync phone country with shipping country - ALWAYS set a string ISO code
    setPhoneCountry(countryIsoCode);
    
    // Clear related field errors
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.shipping_state;
      delete newErrors.shipping_city;
      return newErrors;
    });

    // Re-validate phone when country changes
    if (formData.phone) {
      const phoneError = validateField("phone", formData.phone);
      setFieldErrors((prev) => ({
        ...prev,
        phone: phoneError || undefined,
      }));
    }

    // Mark country as touched
    setTouchedFields((prev) => ({
      ...prev,
      shipping_country: true,
    }));
  };

  // Handle state change from dropdown
  const handleStateChange = (state) => {
    if (!state) return;
    const stateCode = state?.id || "";
    const stateName = state?.name || "";
    setSelectedState(stateCode);
    setSelectedCity("");
    setFormData((prev) => ({
      ...prev,
      shipping_state: stateName || stateCode, // Store name if available, otherwise code
      shipping_city: "",
    }));
    
    // Clear city error
    setFieldErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors.shipping_city;
      return newErrors;
    });

    // Mark state as touched
    setTouchedFields((prev) => ({
      ...prev,
      shipping_state: true,
    }));
  };

  // Handle city change from dropdown
  const handleCityChange = (city) => {
    if (!city) return;
    const cityName = city?.name || "";
    setSelectedCity(cityName);
    setFormData((prev) => ({
      ...prev,
      shipping_city: cityName,
    }));
    
    // Validate city
    const cityError = validateField("shipping_city", cityName);
    setFieldErrors((prev) => ({
      ...prev,
      shipping_city: cityError || undefined,
    }));

    // Mark city as touched
    setTouchedFields((prev) => ({
      ...prev,
      shipping_city: true,
    }));
  };

  // Handle blur event (validate when user leaves field)
  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouchedFields((prev) => ({
      ...prev,
      [name]: true,
    }));

    const fieldError = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: fieldError || undefined,
    }));
  };

  // Handle place order
  const handlePlaceOrder = async () => {
    // Mark all fields as touched
    const allFields = Object.keys(formData);
    const touched = {};
    allFields.forEach((field) => {
      touched[field] = true;
    });
    setTouchedFields(touched);

    // Validate form
    if (!validateForm()) {
      // Find first error field and scroll to it
      const firstErrorField = Object.keys(fieldErrors)[0];
      if (firstErrorField) {
        const element = document.querySelector(`[name="${firstErrorField}"]`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "center" });
          element.focus();
        }
      }
      toast.error("Please fix the errors in the form before proceeding");
      return;
    }

    // Check cart is not empty
    if (!cart.items || cart.items.length === 0) {
      setError("Cart is empty");
      toast.error("Your cart is empty");
      return;
    }

    // Start initial animation (cart rolls out, text fades) - NO checkmark yet
    setIsCheckedOut(true);
    
    setLoading(true);
    setError(null);

    try {
      // Prepare order data with trimmed values
      const orderData = {
        user_name: `${formData.firstName.trim()} ${formData.lastName.trim()}`,
        shipping_address: formData.shipping_address.trim(),
        shipping_city: formData.shipping_city.trim(),
        shipping_state: formData.shipping_state || "",
        shipping_postal_code: formData.shipping_postal_code.trim(),
        shipping_country: formData.shipping_country,
        payment_method: paymentMethod,
        notes: formData.notes?.trim() || "",
      };

      // Create order
      const orderResponse = await orderService.createOrder(orderData, idempotencyKey);
      const createdOrder = orderResponse.order;

      // Use idempotency key from order response (for consistency)
      const orderIdempotencyKey = createdOrder.idempotency_key || idempotencyKey;
      setOrder(createdOrder);

      // Order created successfully - trigger checkmark animation
      setShowCheckmark(true);

      // Handle payment based on method
      if (paymentMethod === "stripe") {
        await handleStripePayment(createdOrder, orderIdempotencyKey);
      } else if (paymentMethod === "paypal") {
        await handlePayPalPayment(createdOrder, orderIdempotencyKey);
      } else {
        throw new Error("Invalid payment method selected");
      }
    } catch (err) {
      console.error("Order creation failed:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
        request: err.request,
      });
      
      let errorMessage = "Failed to create order";
      
      if (err.response) {
        // Server responded with error
        errorMessage =
          err.response.data?.error ||
          err.response.data?.message ||
          `Server error: ${err.response.status} ${err.response.statusText}`;
      } else if (err.request) {
        // Request was made but no response received
        errorMessage = "Network error: Unable to reach server. Please check your connection.";
      } else {
        // Something else happened
        errorMessage = err.message || "An unexpected error occurred";
      }
      
      setError(errorMessage);
      toast.error(errorMessage);
      // Reset animation on error
      setIsCheckedOut(false);
      setShowCheckmark(false);
    } finally {
      setLoading(false);
    }
  };

  // Handle Stripe payment - redirect to Stripe Checkout
  const handleStripePayment = async (order, orderIdempotencyKey) => {
    try {
      console.log("Creating Stripe Checkout Session for order:", {
        order_id: order.id,
        order_number: order.order_number,
        idempotency_key: orderIdempotencyKey,
      });

      const successUrl = `${window.location.origin}/order-confirmation/${order.id}?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${window.location.origin}/cart?canceled=true`;

      // Create checkout session
      const checkoutResponse = await paymentService.createStripeCheckout(
        order.id,
        order.order_number,
        orderIdempotencyKey,
        successUrl,
        cancelUrl
      );

      console.log("Checkout session created successfully:", checkoutResponse);

      // Determine checkout URL (new session or existing one)
      const existingCheckoutUrl =
        checkoutResponse.checkout_url ||
        checkoutResponse.transaction?.metadata?.checkout_session?.url;

      if (existingCheckoutUrl) {
        // Complete animation before redirecting to Stripe
        // Small delay to ensure animation is visible
        setTimeout(() => {
          window.location.href = existingCheckoutUrl;
        }, 300);
        return;
      }

      // No URL returned – surface a clear, user‑friendly error instead of a generic one
      let fallbackMessage =
        checkoutResponse.message ||
        "We couldn't start the payment for this order. Please try again or contact support.";

      // Special‑case some known backend messages for a better UX
      if (checkoutResponse.message === "Payment transaction already exists") {
        fallbackMessage =
          "You already have a payment in progress or completed for this order. Please check your orders or refresh the page before trying again.";
      }

      setError(fallbackMessage);
      toast.error(fallbackMessage);
      throw new Error(fallbackMessage);
    } catch (err) {
      console.error("Stripe checkout creation failed:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        statusText: err.response?.statusText,
      });

      // Provide more detailed error message
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create payment checkout. Please try again.";

      setError(errorMessage);
      toast.error(errorMessage);
      // Reset animation on error
      setIsCheckedOut(false);
      setShowCheckmark(false);
      throw new Error(errorMessage);
    }
  };

  // Handle PayPal payment
  const handlePayPalPayment = async (order, orderIdempotencyKey) => {
    try {
      const returnUrl = `${window.location.origin}/payment/success?order_id=${order.id}`;
      const cancelUrl = `${window.location.origin}/payment/cancel?order_id=${order.id}`;

      const paymentResponse = await paymentService.createPayPalPayment(
        order.id,
        order.order_number,
        orderIdempotencyKey,
        returnUrl,
        cancelUrl
      );

      // Complete animation before redirecting to PayPal
      // Small delay to ensure animation is visible
      setTimeout(() => {
        window.location.href = paymentResponse.approval_url;
      }, 300);
    } catch (err) {
      console.error("PayPal payment creation failed:", err);
      // Reset animation on error
      setIsCheckedOut(false);
      setShowCheckmark(false);
      throw err;
    }
  };

  // Show order placed section if order is created and payment is not needed
  if (showOrderPlaced && order) {
    return <OrderPlacedSection order={order} />;
  }

  // Calculate totals from cart - ensure they are numbers
  const subtotal = parseFloat(cart?.subtotal) || 0;
  const tax = parseFloat(cart?.tax) || 0;
  const shipping = parseFloat(cart?.shipping) || 0;
  const total = parseFloat(cart?.total) || 0;

  // Helper function to get input className with error styling
  const getInputClassName = (fieldName) => {
    const baseClasses = "w-full bg-white py-3 px-5 rounded-full border";
    const hasError = fieldErrors[fieldName] && touchedFields[fieldName];
    return hasError
      ? `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`
      : `${baseClasses} border-[#E5E7EB] focus:border-[#374151] focus:ring-[#374151]`;
  };

  // Helper function to get select className with error styling
  const getSelectClassName = (fieldName) => {
    const baseClasses = "w-full bg-white py-3 px-5 rounded-full border appearance-none";
    const hasError = fieldErrors[fieldName] && touchedFields[fieldName];
    return hasError
      ? `${baseClasses} border-red-500 focus:border-red-500 focus:ring-red-500`
      : `${baseClasses} border-[#E5E7EB] focus:border-[#374151] focus:ring-[#374151]`;
  };

  return (
    <div className="w-full my-[40px]">
      {/* PAGE TITLE */}
      <h2 className="font-normal text-[26px] leading-[100%] tracking-[0] text-[#1D1D1D] mb-8">
        Checkout
      </h2>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* TWO COLUMN GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 w-full">
        {/* LEFT COLUMN — BILLING DETAILS */}
        <div className="w-full flex flex-col gap-6">
          <h3 className="font-normal text-[20px] leading-[100%] text-black align-bottom mb-2">
            Billing details
          </h3>

          {/* FORM GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {/* First Name */}
            <div>
              <label className="text-sm text-[#374151] font-medium mb-2 block">
                First Name *
              </label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={getInputClassName("firstName")}
              />
              {fieldErrors.firstName && touchedFields.firstName && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="text-sm text-[#374151] font-medium mb-2 block">
                Last Name *
              </label>
              <input
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={getInputClassName("lastName")}
              />
              {fieldErrors.lastName && touchedFields.lastName && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.lastName}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="text-sm text-[#374151] font-medium mb-2 block">
                Phone Number *
              </label>
              <div className={`phone-input-wrapper ${fieldErrors.phone && touchedFields.phone ? 'error' : ''}`}>
                <PhoneInput
                  international
                  defaultCountry={typeof phoneCountry === "string" ? phoneCountry : "AE"}
                  country={typeof phoneCountry === "string" ? phoneCountry : "AE"}
                  value={formData.phone}
                  onChange={(value) => {
                    setFormData((prev) => ({ ...prev, phone: value || "" }));
                    // Clear error when user starts typing
                    if (fieldErrors.phone) {
                      setFieldErrors((prev) => ({ ...prev, phone: "" }));
                    }
                  }}
                  onCountryChange={(country) => {
                    if (country) {
                      setPhoneCountry(country);
                      // Re-validate phone when country changes
                      if (formData.phone) {
                        const phoneError = validateField("phone", formData.phone);
                        setFieldErrors((prev) => ({
                          ...prev,
                          phone: phoneError || undefined,
                        }));
                      }
                    }
                  }}
                  onBlur={() => {
                    setTouchedFields((prev) => ({
                      ...prev,
                      phone: true,
                    }));
                    if (formData.phone) {
                      const phoneError = validateField("phone", formData.phone);
                      setFieldErrors((prev) => ({
                        ...prev,
                        phone: phoneError || undefined,
                      }));
                    }
                  }}
                  className="checkout-phone-input"
                />
              </div>
              {fieldErrors.phone && touchedFields.phone && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.phone}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="text-sm text-[#374151] font-medium mb-2 block">
                Email Address *
              </label>
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={getInputClassName("email")}
              />
              {fieldErrors.email && touchedFields.email && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.email}</p>
              )}
            </div>

            {/* Country */}
            <div className="relative">
              <label className="text-sm text-[#374151] font-medium mb-2 block">
                Country *
              </label>
              <CountrySelect
                defaultValue={selectedCountry}
                onChange={(value) => handleCountryChange(value)}
                inputClassName={getSelectClassName("shipping_country")}
                containerClassName="country-state-city-container"
                placeHolder="Select Country"
              />
              {fieldErrors.shipping_country && touchedFields.shipping_country && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.shipping_country}</p>
              )}
            </div>

            {/* State/Emirate - Single selectable field */}
            <div className="relative">
              <label className="text-sm text-[#374151] font-medium mb-2 block">
                {selectedCountry === "AE" ? "Emirate" : "State"} *
              </label>
              {selectedCountry ? (
                <StateSelect
                  countryid={selectedCountry}
                  defaultValue={selectedState}
                  onChange={(value) => handleStateChange(value)}
                  inputClassName={getSelectClassName("shipping_state")}
                  containerClassName="country-state-city-container"
                  placeHolder={`Select ${selectedCountry === "AE" ? "Emirate" : "State"}`}
                />
              ) : (
                <input
                  name="shipping_state"
                  type="text"
                  value={formData.shipping_state}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Select country first"
                  disabled
                  className={`${getInputClassName("shipping_state")} opacity-50 cursor-not-allowed`}
                />
              )}
              {fieldErrors.shipping_state && touchedFields.shipping_state && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.shipping_state}</p>
              )}
            </div>

            {/* City - Single selectable field */}
            <div className="relative">
              <label className="text-sm text-[#374151] font-medium mb-2 block">
                City *
              </label>
              {selectedCountry && selectedState ? (
                <CitySelect
                  countryid={selectedCountry}
                  stateid={selectedState}
                  defaultValue={selectedCity}
                  onChange={(value) => handleCityChange(value)}
                  inputClassName={getSelectClassName("shipping_city")}
                  containerClassName="country-state-city-container"
                  placeHolder="Select City"
                />
              ) : selectedCountry ? (
                <input
                  name="shipping_city"
                  type="text"
                  value={formData.shipping_city}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Select state/emirate first"
                  disabled
                  className={`${getInputClassName("shipping_city")} opacity-50 cursor-not-allowed`}
                />
              ) : (
                <input
                  name="shipping_city"
                  type="text"
                  value={formData.shipping_city}
                  onChange={handleInputChange}
                  onBlur={handleBlur}
                  placeholder="Select country first"
                  disabled
                  className={`${getInputClassName("shipping_city")} opacity-50 cursor-not-allowed`}
                />
              )}
              {fieldErrors.shipping_city && touchedFields.shipping_city && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.shipping_city}</p>
              )}
            </div>

            {/* Zip */}
            <div>
              <label className="text-sm text-[#374151] font-medium mb-2 block">
                Postcode/Zip *
              </label>
              <input
                name="shipping_postal_code"
                type="text"
                value={formData.shipping_postal_code}
                onChange={handleInputChange}
                onBlur={handleBlur}
                maxLength="6"
                pattern="[0-9]{4,6}"
                placeholder="12345"
                required
                className={getInputClassName("shipping_postal_code")}
              />
              {fieldErrors.shipping_postal_code && touchedFields.shipping_postal_code && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.shipping_postal_code}</p>
              )}
            </div>

            {/* Shipping Address (Full width) */}
            <div className="md:col-span-2">
              <label className="text-sm text-[#374151] font-medium mb-2 block">
                Shipping Address *
              </label>
              <input
                name="shipping_address"
                value={formData.shipping_address}
                onChange={handleInputChange}
                onBlur={handleBlur}
                required
                className={getInputClassName("shipping_address")}
              />
              {fieldErrors.shipping_address && touchedFields.shipping_address && (
                <p className="mt-1 text-xs text-red-500">{fieldErrors.shipping_address}</p>
              )}
            </div>

            {/* Notes (Optional) */}
            <div className="md:col-span-2">
              <label className="text-sm text-[#374151] font-medium mb-2 block">
                Order Notes (Optional)
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows="3"
                className="w-full bg-white py-3 px-5 rounded-lg border border-[#E5E7EB] focus:border-[#374151] focus:ring-[#374151]"
              />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — ORDER SUMMARY */}
        <div className="w-full bg-[#faf6f3] rounded-2xl shadow-md p-6">
          <h3 className="font-normal text-[20px] leading-[100%] tracking-normal mb-[30px]">
            Your order
          </h3>

          {/* PRODUCT LIST */}
          <div className="text-sm text-gray-700 mb-4">
            {cart?.items && cart.items.length > 0 ? (
              cart.items.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between py-2 border-b border-[#E5E5E5] mb-[17px]"
                >
                  <div className="flex-1">
                    <span className="font-medium">{item.product_name}</span>
                    {item.size && item.color && (
                      <span className="text-gray-500 text-xs block">
                        {item.size} | {item.color}
                      </span>
                    )}
                    <span className="text-gray-500 text-xs block">
                      Qty: {item.quantity}
                    </span>
                  </div>
                  <span className="font-medium">
                    {item.currency || "AED"}{" "}
                    {item.subtotal
                      ? parseFloat(item.subtotal).toFixed(2)
                      : (parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div className="py-4 text-center text-gray-500">
                Cart is empty
              </div>
            )}

            <div className="flex justify-between py-2 border-b border-[#E5E5E5] font-medium text-gray-800 mb-[17px]">
              <span>Subtotal</span>
              <span>AED {subtotal.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-[#E5E5E5] font-medium text-gray-800 mb-[17px]">
              <span>Tax</span>
              <span>AED {tax.toFixed(2)}</span>
            </div>

            <div className="flex justify-between py-2 border-b border-[#E5E5E5] font-medium text-gray-800 mb-[17px]">
              <span>Shipping</span>
              <span>{shipping > 0 ? `AED ${shipping.toFixed(2)}` : "Free shipping"}</span>
            </div>

            <div className="flex justify-between py-3 text-lg font-semibold text-gray-900 mb-[17px]">
              <span>Total</span>
              <span>AED {total.toFixed(2)}</span>
            </div>
          </div>

          {/* PAYMENT METHOD */}
          <h4 className="text-base font-semibold text-gray-900 mt-6 mb-3">
            Payment Method
          </h4>

          <div className="flex flex-col gap-2 text-sm text-gray-700">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="paymentMethod"
                value="stripe"
                checked={paymentMethod === "stripe"}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="h-4 w-4 rounded-full border-2 border-gray-400 text-[#374151] focus:ring-[#374151] accent-[#374151]"
              />
              💳 Stripe
            </label>
          </div>

          {/* PLACE ORDER BUTTON */}
          <button
            onClick={handlePlaceOrder}
            disabled={loading || !cart?.items || cart.items.length === 0}
            className={`checkout-animated-btn ${isCheckedOut ? 'checked-out' : ''} ${showCheckmark ? 'show-checkmark' : ''}`}
          >
            <svg 
              id="cart-icon" 
              style={{width: '24px', height: '24px'}} 
              viewBox="0 0 24 24"
            >
              <path 
                fill="#fff" 
                d="M17,18A2,2 0 0,1 19,20A2,2 0 0,1 17,22C15.89,22 15,21.1 15,20C15,18.89 15.89,18 17,18M1,2H4.27L5.21,4H20A1,1 0 0,1 21,5C21,5.17 20.95,5.34 20.88,5.5L17.3,11.97C16.96,12.58 16.3,13 15.55,13H8.1L7.2,14.63L7.17,14.75A0.25,0.25 0 0,0 7.42,15H19V17H7C5.89,17 5,16.1 5,15C5,14.65 5.09,14.32 5.24,14.04L6.6,11.59L3,4H1V2M7,18A2,2 0 0,1 9,20A2,2 0 0,1 7,22C5.89,22 5,21.1 5,20C5,18.89 5.89,18 7,18M16,11L18.78,6H6.14L8.5,11H16Z" 
              />
            </svg>
            <span>{loading ? "Processing..." : "Place Order"}</span>
            <svg 
              id="check-icon" 
              style={{width: '24px', height: '24px'}} 
              viewBox="0 0 24 24"
            >
              <path 
                strokeWidth="2" 
                fill="none" 
                stroke="#ffffff" 
                d="M 3,12 l 6,6 l 12, -12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
