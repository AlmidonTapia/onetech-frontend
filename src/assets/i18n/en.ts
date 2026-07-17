export const en = {
  checkout: {
    summaryTitle: 'Your order',
    totalLabel: 'Total',
    labels: {
      subtotal: 'Subtotal',
      discount: 'Discount',
      shipping: 'Shipping',
      couponPlaceholder: 'Discount code'
    },
    steps: ['Destination', 'Shipping', 'Delivery Details', 'Payment', 'Confirm'],
    alerts: {
      successTitle: 'Order placed!',
      successSub: 'Order #',
      successEnd: ' confirmed.',
      error: 'Error processing the order or its secondary services',
      invalidSession: 'Invalid or expired session. Please log in again.',
      sdkNotLoaded: 'Mercado Pago SDK is not loaded. Please reload the page.',
      sdkBlockedTitle: 'SDK blocked or not loaded',
      sdkBlockedMsg: 'Could not load the payment system. Disable your ad blocker and try again.',
      emptyCartTitle: 'Your cart is empty',
      emptyCartMsg: 'Add products to proceed to checkout.',
      brickErrorTitle: 'Payment system error',
      brickError: 'An error occurred while loading the payment form.',
      paymentErrorTitle: 'Payment error',
      paymentError: 'Error processing the charge with your card.',
      initPaymentErrorTitle: 'Error initializing payment',
      initPaymentErrorMsg: 'Could not load the secure payment form. Check your connection or try another payment method.',
      orderErrorTitle: 'Error generating order',
      couponApplied: 'Coupon applied',
      couponAppliedMsg: 'The discount has been applied to your purchase.',
      couponInvalid: 'Invalid or expired coupon.',
      paymentSuccessMsg: 'Your payment was processed successfully. Order #{id} confirmed.'
    },
    buttons: {
      back: 'Back',
      continue: 'Continue',
      confirmAndPay: 'Confirm and Pay',
      apply: 'Apply'
    },
    aside: {
      deliveryAddress: 'Delivery Address',
      shippingAgency: 'Shipping Agency',
      receiver: 'Receiver',
      paymentMethod: 'Payment Method',
      myself: 'Myself'
    },
    securePayment: {
      title: 'Secure Payment with MercadoPago',
      description: 'Your payment information is end-to-end encrypted. Enter your card details to process the charge of ',
      header: 'Enter your card details'
    },
    consignee: {
      title: 'Delivery Details',
      subtitle: 'Who will receive the order?',
      selfLabel: 'I will receive the order myself',
      selfFillLabel: 'Your shipping details',
      othersLabel: 'Details of the person receiving the order',
      fullNameLabel: 'Full Name',
      docNumberLabel: 'Identity Document (ID)',
      phoneLabel: 'Mobile Number',
      disclaimerTitle: 'Important for shipping:',
      disclaimerText: 'These details are exclusively for shipping and pickup by the agency, and are different from the payment receipt details.',
      policiesInfoPre: 'To guarantee a successful delivery, we invite you to review our',
      policiesInfoLink: 'shipping policies',
      policiesInfoPost: '. Make sure the entered data is correct.',
      policiesAccept: 'I have read and accept the shipping policies and delivery conditions.'
    },
    destination: {
      title: 'Select your Destination',
      subtitle: 'Select your city to see which shipping agencies are available.',
      deptLabel: 'Region/Department',
      provLabel: 'Province',
      distLabel: 'District',
      deptPlaceholder: 'Select a region',
      provPlaceholder: 'Select a province',
      distPlaceholder: 'Select a district'
    },
    payment: {
      title: 'Payment Method',
      couponTitle: 'Do you have a discount code?',
      couponSuccess: 'Coupon applied successfully'
    },
    shipping: {
      title: 'Shipping Method',
      loading: 'Loading available agencies...',
      noAvailable: 'There are no shipping methods available for this area.'
    },
    confirmReview: {
      title: 'Review your order before confirming',
      descriptionPre: 'Check the details in the right panel. If everything is correct, click on',
      descriptionPost: '.'
    }
  },
  cart: {
    title: 'My Cart',
    breadcrumbLabel: 'Shopping Cart',
    loadingLabel: 'Loading cart...',
    emptyTitle: 'Your cart is empty',
    emptyDescription: 'Add products to start your purchase.',
    exploreBtnLabel: 'Explore products',
    alertRemoved: 'Product removed from cart',
    alertRemoveError: 'Error removing product',
    alertUpdateError: 'Error updating quantity',
    items: {
      each: 'ea',
      remove: 'Remove'
    },
    summary: {
      title: 'Order Summary',
      subtotalLabel: 'Subtotal',
      singularProduct: 'product',
      pluralProduct: 'products',
      shippingLabel: 'Shipping',
      calculatingLabel: 'To be calculated',
      totalLabel: 'Total',
      checkoutBtnLabel: 'Proceed to Checkout',
      continueShoppingText: 'Continue Shopping',
      paymentMethodsTitle: 'We accept:'
    }
  },
  catalog: {
    breadcrumbLabel: 'Catalog',
    seoTitle: 'Product Catalog',
    seoDescription: 'Explore our wide variety of tech products. Laptops, PC components, smartphones, and more.',
    mobileFilterBtn: 'Filters',
    mobileDrawerTitle: 'Filters',
    filters: {
      mainTitle: 'Filters',
      resetBtnText: 'Reset',
      categoryTitle: 'Categories',
      allCategoriesOption: 'All categories',
      brandTitle: 'Brands',
      allBrandsOption: 'All',
      priceTitle: 'Price (S/)',
      minPricePlaceholder: 'Min',
      maxPricePlaceholder: 'Max',
      applyBtnLabel: 'Apply filters'
    },
    sort: {
      resultsSuffix: 'products found',
      sortLabelText: 'Sort by:',
      options: {
        relevance: 'Relevance',
        price_asc: 'Price: Low to High',
        price_desc: 'Price: High to Low',
        name_asc: 'Name A-Z',
        newest: 'Newest first'
      }
    },
    grid: {
      emptyTitle: 'No results',
      emptyDescription: 'Try other filters or search terms.'
    }
  },
  orders: {
    title: 'My Orders',
    subtitle: 'Complete history of your purchases on OneTech.',
    breadcrumbLabel: 'My Orders',
    loadingLabel: 'Loading orders...',
    errorLoadingTitle: 'Error loading orders',
    errorLoadingMsg: 'Could not fetch your orders. Check your connection and try again.',
    list: {
      orderPrefix: 'Order #',
      productSuffixSingular: 'product',
      productSuffixPlural: 'products',
      actionBtnLabel: 'View details',
      loadingLabel: 'Loading your orders...',
      emptyTitle: 'You have no orders yet',
      emptyDescription: 'Your purchase history is empty. Explore the store to get started.',
    },
    status: {
      PENDIENTE: 'Pending',
      PAGADO: 'Paid',
      ENVIADO: 'Shipped',
      COMPLETADO: 'Completed',
      CANCELADO: 'Cancelled',
      EXPIRADO: 'Expired',
      expiredLabel: 'Expired'
    },
    shipmentSteps: {
      EN_PREPARACION: 'Preparation',
      EN_CAMINO: 'On the way',
      ENTREGADO: 'Delivered'
    },
    detail: {
      headerPrefix: 'Order #',
      sections: {
        productsTitle: 'Products',
        infoTitle: 'Order Information',
        shipmentTitle: 'Shipment Tracking'
      },
      totals: {
        subtotalLabel: 'Subtotal',
        grandTotalLabel: 'Total Paid',
        unitSuffix: ' ea'
      },
      labels: {
        client: 'Client',
        orderId: 'Order ID',
        trackingNumber: 'Tracking Code',
        estimatedArrival: 'Estimated Delivery',
        noShipment: 'The shipment is being prepared. The tracking code will be available soon.',
        loadingShipment: 'Loading shipment information...',
        discount: 'Discount',
        shipping: 'Shipping',
        expiresIn: 'Expires in: ',
        pickupCode: 'Pickup Code'
      },
      actions: {
        closeLabel: 'Close'
      }
    }
  },
  navbar: {
    ariaLabelLogo: 'OneTech — Home',
    ariaLabelNav: 'Categories',
    topbar: {
      shipping: 'Nationwide shipping',
      phone: 'Contact phone',
      hours: 'Business hours'
    },
    admin: {
      labelPre: 'Admin',
      labelPost: 'Panel'
    },
    wishlist: {
      title: 'My wishlist',
      labelPre: 'My',
      labelPost: 'Wishlist'
    },
    cart: {
      ariaLabelCart: 'View cart',
      labelText: 'Cart',
      emptyTitle: 'Your cart is empty',
      goToCartBtn: 'View full cart',
      checkoutBtn: 'Go to checkout',
      totalLabel: 'Total:'
    },
    menu: {
      ariaLabelNav: 'Category navigation',
      allCategoriesLabel: 'All categories',
      offersLabel: '⚡ Offers',
      aboutLabel: 'About us',
      aboutItems: {
        whoWeAre: 'Who we are',
        faq: 'FAQ',
        terms: 'Terms and conditions',
        privacy: 'Privacy policy',
        contact: 'Contact'
      }
    },
    search: {
      placeholderText: 'Search laptops, monitors, components...',
      ariaLabelInput: 'Search products',
      ariaLabelButton: 'Search',
      searching: 'Searching...',
      viewAllResults: 'View all results for',
      noResults: 'No results found for'
    },
    user: {
      guestLabel: 'Welcome',
      guestName: 'Log in',
      userLabel: 'MY ACCOUNT',
      userDefaultName: 'User',
      menu: {
        profile: 'My profile',
        orders: 'My orders',
        wishlist: 'Wishlist'
      },
      viewProfile: 'view my details',
      logout: 'Log out'
    }
  },
  footer: {
    tagline: 'Your trusted technology store. The best products at the best prices.',
    headings: {
      help: 'Help',
      contact: 'Contact'
    },
    copyPre: '© ',
    copyPost: ' OneTech. All rights reserved.',
    contact: {
      loading: 'Loading...',
      unavailable: 'Unavailable',
      hours: 'Monday to Saturday: 9:00 AM - 6:00 PM'
    }
  },
  adminLayout: {
    sidebar: {
      ariaLabelNav: 'Admin Menu',
      ariaLabelExpand: 'Expand menu',
      ariaLabelCollapse: 'Collapse menu',
      logoCollapsed: 'OT'
    },
    topbar: {
      searchPlaceholder: 'Enter module...',
      searchAriaLabel: 'Search',
      profileRole: 'Administrator',
      logout: 'Log Out'
    },
    navItems: {
      dashboard: 'Dashboard',
      products: 'Products',
      categories: 'Categories',
      brands: 'Brands',
      inventory: 'Inventory',
      coupons: 'Coupons',
      orders: 'Orders',
      shipments: 'Shipments',
      shipping: 'Logistics / Shipping',
      paymentMethods: 'Payment Methods',
      invoices: 'Invoices',
      users: 'Users',
      reviews: 'Reviews',
      inbox: 'Inbox',
      settings: 'Settings',
      profile: 'My Profile'
    }
  },
  adminDashboard: {
    title: 'Dashboard',
    subtitle: 'Business Overview',
    loadingLabel: 'Loading data...',
    stats: {
      productsTitle: 'Products',
      productsSuffix: 'registered',
      ordersTitle: 'Orders',
      ordersSuffix: 'in total',
      usersTitle: 'Users',
      usersSuffix: 'registered',
      pendingTitle: 'Pending',
      pendingSuffix: 'to process'
    },
    chart: {
      title: 'Orders by Status',
      subtitle: 'last 10 orders',
      emptyMessage: 'No data available',
      labels: {
        pending: 'Pending',
        paid: 'Paid',
        shipped: 'Shipped',
        completed: 'Completed',
        cancelled: 'Cancelled'
      }
    },
    recentOrders: {
      title: 'Recent Orders',
      viewAllLabel: 'View all →',
      emptyMessage: 'No recent orders.'
    }
  },
  adminProducts: {
    title: 'Products',
    countSuffix: 'registered products',
    createBtnLabel: 'New product',
    searchPlaceholder: 'Search by name or SKU...',
    refreshBtnLabel: 'Refresh',
    alerts: {
      createSuccess: 'Product created',
      updateSuccess: 'Product updated',
      saveError: 'Error saving product',
      deleteSuccess: 'Product deleted',
      deleteError: 'Error deleting product',
      imageUploadSuccess: 'Images uploaded successfully',
      imageUploadError: 'Error uploading images',
      imageDeleteSuccess: 'Image deleted',
      imageDeleteError: 'Error deleting image',
      imageMainSuccess: 'Image set as main',
      imageMainError: 'Error setting main image'
    },
    confirmModal: {
      title: 'Delete product?',
      confirmLabel: 'Yes, delete',
      messageText: 'will be permanently deleted.'
    },
    table: {
      allStatuses: 'All statuses',
      allCategories: 'All categories',
      allBrands: 'All brands',
      quickSearchTitle: 'Product Catalog',
      searchPlaceholder: 'Search product...',
      emptyMessage: 'No products found.',
      headers: {
        img: 'Img',
        product: 'Product',
        sku: 'SKU',
        category: 'Category',
        brand: 'Brand',
        price: 'Price',
        stock: 'Stock',
        status: 'Status',
        actions: 'Actions'
      },
      tooltips: {
        images: 'Images',
        edit: 'Edit',
        delete: 'Delete'
      },
      deleteLabel: 'Delete',
      status: {
        active: 'Active',
        inactive: 'Inactive',
        outOfStock: 'Out of stock'
      }
    },
    form: {
      titleNew: 'New Product',
      titleEdit: 'Edit Product',
      errorRequired: 'Required field',
      metaLabel: 'Last modified:',
      cancelLabel: 'Cancel',
      saveLabel: 'Save',
      specs: {
        title: 'Technical Specifications',
        addLabel: 'Add Property',
        keyPlaceholder: 'Property (e.g., RAM, Processor)',
        valuePlaceholder: 'Value (e.g., 16GB, Intel i7)',
        deleteTitle: 'Delete property',
        emptyMessage: 'No specifications added for this product.'
      },
      imagesInfo: {
        newProductMsg: 'You can upload images once you save the product for the first time.',
        manageBtnLabel: 'Manage Images'
      },
      badges: {
        none: 'None',
        new: 'New',
        bestseller: 'Bestseller',
        offer: 'Offer'
      },
      fields: {
        name: 'Product name *',
        namePlaceholder: 'e.g., Asus ROG Laptop',
        sku: 'SKU *',
        skuPlaceholder: 'e.g., LAP-ASUS-01',
        category: 'Category *',
        categoryPlaceholder: 'Select category',
        brand: 'Brand *',
        brandPlaceholder: 'Select brand',
        price: 'Price *',
        originalPrice: 'Original Price (Optional)',
        stock: 'Initial Stock *',
        status: 'Status *',
        statusPlaceholder: 'Select status',
        badge: 'Badge',
        badgePlaceholder: 'No badge',
        description: 'Product description *',
        descriptionPlaceholder: 'Enter specifications and main features...'
      }
    },
    images: {
      headerPrefix: 'Images — ',
      altText: 'Product image',
      mainBadgeLabel: 'Main',
      emptyMessage: 'No images. Upload the first image below.',
      uploadedImages: 'Uploaded images',
      setMainTooltip: 'Set as main',
      deleteTooltip: 'Delete image',
      uploadNewTitle: 'Upload new images',
      upload: {
        chooseLabel: 'Choose images',
        uploadLabel: 'Upload',
        cancelLabel: 'Clear',
        note: 'Supports multiple files. Limit of 5 images in total. Max size: 10MB.'
      },
      closeLabel: 'Close'
    }
  },
  adminOrders: {
    title: 'Orders',
    countSuffix: 'total orders',
    alerts: {
      updateSuccess: 'Status successfully updated',
      updateError: 'Error updating status'
    },
    table: {
      allStatuses: 'All',
      quickSearchTitle: 'Quick Search',
      searchPlaceholder: 'Order ID, Client...',
      emptyMessage: 'No orders registered.',
      headers: {
        orderId: 'Order ID',
        client: 'Client',
        date: 'Date',
        total: 'Total',
        status: 'Status',
        actions: 'Actions'
      },
      tooltips: {
        viewDetail: 'View details',
        changeStatus: 'Change status',
        automatedStatus: 'Status automated by payment/shipping'
      }
    },
    form: {
      headerTitle: 'Change order status',
      labels: {
        order: 'Order:',
        client: 'Client:',
        total: 'Total:',
        newStatus: 'New status *'
      },
      placeholderSelect: 'Select status',
      actions: {
        cancelLabel: 'Cancel',
        saveLabel: 'Update status'
      }
    }
  },
  adminCategories: {
    title: 'Categories',
    countSuffix: 'registered categories',
    createBtnLabel: 'New category',
    alerts: {
      saveSuccess: 'Category saved',
      saveError: 'Error saving',
      deleteSuccess: 'Category successfully deleted',
      deleteError: 'Error deleting category'
    },
    confirmModal: {
      title: 'Delete category?',
      confirmLabel: 'Yes, delete',
      messageText: 'will be deleted.'
    },
    table: {
      quickSearchTitle: 'Quick Search',
      searchPlaceholder: 'Search categories...',
      emptyMessage: 'No categories registered.',
      headers: {
        name: 'Name',
        parent: 'Parent category',
        actions: 'Actions'
      },
      rootCategoryLabel: 'Root category',
      tooltips: {
        edit: 'Edit',
        delete: 'Delete'
      }
    },
    form: {
      titleNew: 'New Category',
      titleEdit: 'Edit Category',
      optionalText: '(optional)',
      errorRequired: 'Required field',
      status: {
        label: 'Status',
        enabled: 'Enabled',
        disabled: 'Disabled'
      },
      fields: {
        name: 'Name *',
        namePlaceholder: 'e.g., Laptops & PCs',
        parent: 'Parent category',
        parentPlaceholder: 'No parent category'
      },
      actions: {
        cancelLabel: 'Cancel',
        saveLabel: 'Save'
      }
    }
  },
  adminBrands: {
    title: 'Brands',
    countSuffix: 'registered brands',
    createBtnLabel: 'New brand',
    alerts: {
      saveSuccess: 'Brand saved',
      saveError: 'Error saving',
      deleteSuccess: 'Brand successfully deleted',
      deleteError: 'Error deleting brand',
      uploadError: 'Brand saved, but an error occurred uploading the image'
    },
    confirmModal: {
      title: 'Delete brand?',
      confirmLabel: 'Yes, delete',
      messageText: 'will be deleted.'
    },
    table: {
      quickSearchTitle: 'Quick Search',
      searchPlaceholder: 'Search brands...',
      emptyMessage: 'No brands registered.',
      headers: {
        brand: 'Brand',
        actions: 'Actions'
      },
      tooltips: {
        edit: 'Edit',
        delete: 'Delete'
      }
    },
    form: {
      titleNew: 'New Brand',
      titleEdit: 'Edit Brand',
      errorRequired: 'Required field',
      status: {
        label: 'Status',
        enabled: 'Enabled',
        disabled: 'Disabled'
      },
      fields: {
        name: 'Brand name *',
        namePlaceholder: 'e.g., HP, Lenovo, Samsung'
      },
      image: {
        label: 'Brand image',
        changeText: 'Change image',
        selectText: 'Select image'
      },
      actions: {
        cancelLabel: 'Cancel',
        saveLabel: 'Save'
      }
    }
  },
  adminInventory: {
    title: 'Inventory',
    countSuffix: 'registered movements',
    createBtnLabel: 'Register movement',
    alerts: {
      success: 'Movement successfully registered',
      error: 'Error registering movement',
      cancelSuccess: 'Inventory movement successfully canceled',
      cancelError: 'Error canceling inventory movement'
    },
    confirmModal: {
      title: 'Cancel movement?',
      message: 'This action will cancel the selected movement and permanently revert the affected product stock.',
      confirmLabel: 'Yes, cancel'
    },
    table: {
      quickSearchTitle: 'Quick Search',
      searchPlaceholder: 'Search inventory...',
      emptyMessage: 'No movements registered.',
      headers: {
        product: 'Product',
        type: 'Type',
        quantity: 'Quantity',
        reason: 'Reason',
        date: 'Date',
        status: 'Status',
        actions: 'Actions'
      },
      types: {
        all: 'All types',
        in: 'In (IN)',
        out: 'Out (OUT)'
      },
      labels: {
        inText: 'In',
        outText: 'Out',
        enabledText: 'Enabled',
        canceledText: 'Canceled'
      }
    },
    form: {
      headerTitle: 'Register inventory movement',
      errorRequired: 'Reason is required',
      fields: {
        product: 'Product *',
        type: 'Movement type *',
        quantity: 'Quantity *',
        reason: 'Reason *',
        reasonPlaceholder: 'e.g., Supplier purchase, Sale, Adjustment...',
        productPlaceholder: 'Select product',
        searchPlaceholder: 'Search...',
        errorMinQuantity: 'Minimum quantity is 1'
      },
      actions: {
        cancelLabel: 'Cancel',
        saveLabel: 'Register movement'
      }
    }
  },
  adminShipments: {
    title: 'Shipments',
    countSuffix: 'registered shipments',
    createBtnLabel: 'New shipment',
    alerts: {
      createSuccess: 'Shipment created successfully',
      createError: 'Error creating shipment',
      dispatchSuccess: 'Shipment dispatched successfully',
      dispatchError: 'Error dispatching shipment',
      updateSuccess: 'Status updated',
      updateError: 'Error updating status'
    },
    table: {
      quickSearchTitle: 'Quick Search',
      searchPlaceholder: 'Tracking or ID...',
      emptyMessage: 'No shipments registered.',
      headers: {
        orderId: 'Order ID',
        method: 'Method',
        tracking: 'Tracking',
        cost: 'Cost',
        shippedAt: 'Date Shipped',
        arrival: 'Estimated Arrival',
        status: 'Status',
        actions: 'Actions'
      }
    },
    form: {
      titleNew: 'New Shipment',
      titleDispatch: 'Dispatch Shipment',
      titleView: 'Shipment Details',
      errorRequired: 'Required field',
      errorImageRequired: 'You must select an image.',
      errorImageFormat: 'Only images allowed (JPG, PNG, WEBP).',
      errorImageSize: 'Image must not exceed 5MB.',
      fields: {
        orderId: 'Order ID *',
        orderIdPlaceholder: 'e.g., ord_123',
        method: 'Shipping Method *',
        methodPlaceholder: 'Select method',
        cost: 'Cost (S/.) *',
        estimatedArrival: 'Estimated Arrival *',
        trackingNumber: 'Tracking Number *',
        trackingPlaceholder: 'e.g., TRK-987',
        pickupCode: 'Pickup Code *',
        pickupCodePlaceholder: 'e.g., REC-123',
        shippedAt: 'Shipping Date & Time *',
        receiptImage: 'Shipping Receipt Photo *'
      },
      details: {
        status: 'Status:',
        orderId: 'Order ID:',
        trackingNumber: 'Tracking Number:',
        pickupCode: 'Pickup Code:',
        shippedAt: 'Date Shipped:',
        estimatedArrival: 'Estimated Arrival:',
        actualArrival: 'Actual Arrival:',
        receiptImage: 'Shipping Receipt:',
        viewReceipt: 'View Receipt',
        unknownMethod: 'Unknown'
      },
      actions: {
        cancelLabel: 'Close',
        saveLabel: 'Save',
        dispatchLabel: 'Dispatch',
        deliveredLabel: 'Mark Delivered',
        returnedLabel: 'Mark Returned',
        pendingReturn: 'Pending Return',
        receiveWarehouse: 'Receive in Warehouse'
      },
      statusConfig: {
        inPreparation: { label: 'In Preparation', tooltip: 'Dispatch Shipment' },
        onTheWay: { label: 'On the Way', tooltip: 'Manage Delivery' },
        delivered: { label: 'Delivered', tooltip: 'View Details' },
        pendingReturn: { label: 'Pending Return', tooltip: 'Receive in Warehouse' },
        returned: { label: 'Returned', tooltip: 'View Details' }
      }
    }
  },
  adminUsers: {
    title: 'Users',
    countSuffix: 'registered users',
    table: {
      quickSearchTitle: 'Quick Search',
      searchPlaceholder: 'Name, email, DNI...',
      emptyMessage: 'No users registered.',
      notRegisteredLabel: 'Not registered',
      headers: {
        fullName: 'Full Name',
        email: 'Email',
        role: 'Role',
        status: 'Status',
        phone: 'Phone',
        regDate: 'Registration Date'
      },
      roles: {
        all: 'All roles',
        admin: 'Admin',
        client: 'Client'
      },
      statuses: {
        all: 'All statuses',
        enabled: 'Enabled',
        disabled: 'Disabled'
      }
    }
  },
  adminCoupons: {
    title: 'Coupons',
    countSuffix: 'registered coupons',
    createBtnLabel: 'New Coupon',
    alerts: {
      createSuccess: 'Coupon created',
      updateSuccess: 'Coupon updated',
      saveError: 'Error saving coupon',
      deleteSuccess: 'Coupon deleted',
      deleteError: 'Error deleting coupon'
    },
    confirmModal: {
      title: 'Delete coupon?',
      deleteMessage: 'The coupon "{code}" will be permanently deleted.',
      confirmLabel: 'Yes, delete'
    },
    table: {
      quickSearchTitle: 'Quick Search',
      searchPlaceholder: 'Coupon code...',
      emptyMessage: 'No coupons found.',
      headers: {
        code: 'Code',
        discountType: 'Type',
        discountValue: 'Value',
        startDate: 'Start',
        expirationDate: 'Expiration',
        usageLimit: 'Usage Limit',
        usedCount: 'Used',
        active: 'Active',
        actions: 'Actions'
      },
      tooltips: {
        edit: 'Edit',
        delete: 'Delete'
      },
      types: {
        all: 'All types',
        percentage: 'Percentage',
        fixed: 'Fixed',
        fixedLabel: 'Fixed amount'
      },
      statuses: {
        all: 'All statuses',
        active: 'Active',
        inactive: 'Inactive',
        exhausted: 'Exhausted',
        expired: 'Expired'
      },
      values: {
        immediate: 'Immediate',
        noLimit: 'No limit'
      }
    },
    form: {
      titleNew: 'New Coupon',
      titleEdit: 'Edit Coupon',
      errorRequired: 'Required field',
      actions: {
        cancelLabel: 'Cancel',
        saveLabel: 'Save Coupon'
      },
      fields: {
        codeLabel: 'Coupon Code *',
        codePlaceholder: 'e.g., SUMMER2026',
        typeLabel: 'Discount Type *',
        valueLabel: 'Discount Value *',
        startDateLabel: 'Start Date (Optional)',
        expirationLabel: 'Expiration Date *',
        limitLabel: 'Usage Limit (Optional)',
        statusLabel: 'Status'
      }
    }
  },
  adminShipmentMethods: {
    title: 'Shipment Methods',
    badgeSuffix: ' methods',
    newBtnLabel: 'New Method',
    table: {
      quickSearchTitle: 'Quick Search',
      searchPlaceholder: 'Search method...',
      headers: {
        name: 'Method Name',
        price: 'Base Price',
        status: 'Status',
        actions: 'Actions'
      },
      emptyMsg: 'No shipment methods registered.'
    },
    dialog: {
      createTitle: 'New Shipment Method',
      editTitle: 'Edit Shipment Method',
      fields: {
        name: 'Method Name',
        namePlaceholder: 'e.g., Express',
        price: 'Base Price',
        status: 'Status',
        statusPlaceholder: 'Select a status'
      },
      actions: {
        cancel: 'Cancel',
        save: 'Save'
      }
    },
    confirmDelete: {
      title: 'Delete shipment method?',
      message: 'The shipment method "{name}" will be permanently deleted.',
      confirmLabel: 'Yes, delete'
    },
    alerts: {
      saveSuccess: 'Shipment method saved',
      saveError: 'Error saving method',
      deleteSuccess: 'Shipment method successfully deleted',
      deleteError: 'Error deleting shipment method'
    },
    statuses: {
      active: 'Active',
      inactive: 'Inactive'
    }
  },
  adminShipping: {
    title: 'Logistics and Shipping',
    description: 'Manage available shipping agencies and configure rates or coverage by Ubigeo.',
    tabs: {
      agencies: 'Agencies / Methods',
      rates: 'Coverage and Rates',
      locations: 'Locations'
    },
    agencies: {
      title: 'Shipping Methods',
      badgeSuffix: ' methods',
      newBtnLabel: 'New Method',
      table: {
        quickSearchTitle: 'Quick Search',
        searchPlaceholder: 'Search agency...',
        headers: {
          name: 'Method Name',
          price: 'Base Price',
          status: 'Status',
          actions: 'Actions'
        },
        emptyMsg: 'No shipping methods registered.'
      },
      dialog: {
        createTitle: 'New Shipping Method',
        editTitle: 'Edit Shipping Method',
        fields: {
          name: 'Method Name',
          namePlaceholder: 'e.g., Express',
          price: 'Base Price',
          status: 'Status',
          statusPlaceholder: 'Select a status'
        },
        actions: {
          cancel: 'Cancel',
          save: 'Save'
        }
      },
      confirmDelete: {
        title: 'Delete shipping method?',
        message: 'The shipping method "{name}" will be permanently deleted.',
        confirmLabel: 'Yes, delete'
      },
      alerts: {
        saveSuccess: 'Shipping method saved',
        saveError: 'Error saving method',
        deleteSuccess: 'Shipping method successfully deleted',
        deleteError: 'Error deleting shipping method'
      },
      statuses: {
        active: 'Active',
        inactive: 'Inactive'
      }
    },
    rates: {
      title: 'Shipping Rates',
      newRateBtn: 'New Rate',
      quickSearch: 'Quick search',
      searchPlaceholder: 'Search agency or ubigeo...',
      emptyTable: 'No rates found matching the applied filters.',
      columns: {
        agency: 'Agency / Carrier',
        destination: 'Destination (Ubigeo)',
        address: 'Address',
        cost: 'Additional Cost',
        status: 'Status',
        actions: 'Actions'
      },
      modal: {
        createTitle: 'Configure New Rate',
        editTitle: 'Edit Existing Rate',
        cancelBtn: 'Cancel',
        saveBtn: 'Save Rate'
      },
      filter: {
        agencyPlaceholder: 'All Agencies',
        deptPlaceholder: 'All Departments',
        provPlaceholder: 'All Provinces'
      },
      form: {
        agencyLabel: 'Shipping Agency *',
        departmentLabel: 'Department (Optional)',
        provinceLabel: 'Province (Optional)',
        districtLabel: 'District (Optional)',
        addressLabel: 'Branch Address (Optional)',
        costLabel: 'Additional Cost *',
        availableLabel: 'Available',
        agencyPlaceholder: 'Select an agency',
        addressPlaceholder: 'e.g.: Main St. 123'
      },
      filters: {
        allStatuses: 'All statuses',
        available: 'Available',
        unavailable: 'Unavailable',
        allAgencies: 'All Agencies',
        allDepartments: 'All Departments',
        allProvinces: 'All Provinces'
      },
      alerts: {
        loadError: 'Error loading rates',
        deleteSuccess: 'Rate deleted',
        deleteError: 'Error deleting rate',
        requireDestination: 'Add at least one destination for the rate.',
        saveSuccess: 'Rate updated',
        saveError: 'Error updating rate',
        createSuccess: '{count} rate(s) successfully created',
        createError: 'There was an error creating some rates'
      },
      confirmDelete: {
        title: 'Delete rate?',
        message: 'Are you sure you want to delete this rate for {agency}?',
        confirmLabel: 'Yes, delete'
      },
      values: {
        national: 'National (All)'
      }
    },
    locations: {
      deptTitle: 'Departments',
      provTitle: 'Provinces',
      distTitle: 'Districts',
      deptEmpty: 'No departments',
      provEmpty: 'No provinces',
      distEmpty: 'No districts',
      provPlaceholder: 'Select a department',
      distPlaceholder: 'Select a province',
      dialogs: {
        department: 'New Department',
        province: 'New Province',
        district: 'New District'
      },
      alerts: {
        loadDeptError: 'Error loading departments',
        loadProvError: 'Error loading provinces',
        loadDistError: 'Error loading districts',
        createDeptSuccess: 'Department created',
        createProvSuccess: 'Province created',
        createDistSuccess: 'District created',
        createError: 'Error creating. Verify that the code is not duplicated.',
        deleteDeptSuccess: 'Department deleted',
        deleteProvSuccess: 'Province deleted',
        deleteDistSuccess: 'District deleted',
        deleteDeptError: 'Error deleting department',
        deleteProvError: 'Error deleting province',
        deleteDistError: 'Error deleting district'
      },
      confirmDelete: {
        departmentTitle: 'Delete department?',
        departmentMsg: '"{name}" and all its associated provinces and districts will be deleted.',
        provinceTitle: 'Delete province?',
        provinceMsg: '"{name}" and all its associated districts will be deleted.',
        districtTitle: 'Delete district?',
        districtMsg: '"{name}" will be permanently deleted.',
        confirmLabel: 'Yes, delete'
      },
      hints: {
        department: '2-digit code (e.g., 15)',
        province: '4-digit code (e.g., 1501)',
        district: '6-digit code (e.g., 150101)'
      },
      panel: {
        newBtn: 'New',
        loading: 'Loading...',
        deleteTooltip: 'Delete'
      }
    },
    destinationPicker: {
      title: 'Coverage Destinations',
      hint: 'Select a location and click "Add" to include destinations.',
      department: 'Department',
      provinces: 'Provinces (Multiple)',
      districts: 'Districts (Multiple)',
      selected: '{0} selected',
      address: 'Agency Local Address in this destination (Optional)',
      addressLabel: 'Address: {address}',
      addBtn: 'Add Destination',
      removeTooltip: 'Remove',
      emptyState: 'No destinations added. Use the selectors above to add coverage zones.',
      alerts: {
        requireLevel: 'Select at least one location level',
        duplicates: 'The selected destinations have already been added'
      }
    }
  },
  adminPaymentMethods: {
    title: 'Payment Methods',
    badgeSuffix: ' methods',
    newBtnLabel: 'New Method',
    table: {
      quickSearchTitle: 'Quick Search',
      searchPlaceholder: 'Method name...',
      headers: {
        name: 'Method Name',
        status: 'Status',
        actions: 'Actions'
      },
      emptyMessage: 'No payment methods registered.'
    },
    form: {
      titleNew: 'New Payment Method',
      titleEdit: 'Edit Payment Method',
      labels: {
        name: 'Method Name',
        status: 'Status'
      },
      statusOptions: {
        active: 'Active',
        inactive: 'Inactive'
      },
      placeholders: {
        name: 'Ex: Credit Card, PayPal'
      },
      buttons: {
        cancel: 'Cancel',
        save: 'Save'
      }
    },
    alerts: {
      saveSuccess: 'Payment method saved',
      saveError: 'Error saving method',
      deleteSuccess: 'Payment method successfully deleted',
      deleteError: 'Error deleting the payment method'
    },
    confirmDelete: {
      title: 'Delete payment method?',
      message: 'The payment method "{name}" will be permanently deleted.',
      confirmLabel: 'Yes, delete'
    }
  },
  adminReviews: {
    title: 'Reviews Moderation',
    subtitle: 'Manage, approve or delete reviews left by customers on products.',
    quickSearchTitle: 'Quick Search',
    searchPlaceholder: 'Comment or title...',
    emptyMessage: 'No reviews registered yet.',
    headers: {
      date: 'Date',
      product: 'Product',
      client: 'Client',
      rating: 'Rating',
      comment: 'Comment',
      status: 'Status',
      actions: 'Actions'
    },
    status: {
      approved: 'Approved',
      pending: 'Pending',
      rejected: 'Rejected'
    },
    filters: {
      allRatings: 'All ratings',
      stars: '{count} Stars',
      star: '1 Star',
      allStatuses: 'All statuses',
      approved: 'Approved',
      pending: 'Pending',
      rejected: 'Rejected'
    },
    actions: {
      approve: 'Approve',
      reject: 'Reject',
      restore: 'Restore to pending'
    },
    alerts: {
      loadError: 'Error loading reviews',
      approveSuccess: 'Review approved',
      approveError: 'Error approving review',
      rejectSuccess: 'Review rejected',
      rejectError: 'Error rejecting review',
      deleteSuccess: 'Review deleted',
      deleteError: 'Error deleting review'
    }
  },
  adminInbox: {
    title: 'Inbox',
    subtitle: 'Manage messages sent by customers from the contact form.',
    badgeSuffix: ' unread',
    table: {
      quickSearchTitle: 'Quick Search',
      searchPlaceholder: 'Name, email or subject...',
      emptyMessage: 'No messages in the inbox.',
      headers: {
        date: 'Date',
        name: 'Name',
        email: 'Email',
        subject: 'Subject',
        status: 'Status',
        actions: 'Actions'
      },
      statusLabels: {
        unread: 'Unread',
        read: 'Read',
        replied: 'Replied'
      },
      icons: {
        view: 'pi pi-eye',
        reply: 'pi pi-reply',
        delete: 'pi pi-trash'
      },
      actions: {
        markRead: 'Mark as Read',
        markUnread: 'Mark as Unread',
        markReplied: 'Mark as Replied',
        delete: 'Delete'
      },
      confirmDelete: {
        title: 'Confirm Deletion',
        message: 'Are you sure you want to delete the message from {name}?',
        acceptLabel: 'Yes, Delete',
        rejectLabel: 'Cancel'
      }
    },
    alerts: {
      loadError: 'Error loading messages',
      statusSuccess: 'Status updated',
      statusError: 'Error updating status',
      deleteSuccess: 'Message deleted',
      deleteError: 'Error deleting message'
    }
  },
  adminProfile: {
    title: 'My Profile',
    subtitle: 'Manage your personal information and security',
    tabs: {
      info: 'Personal Information',
      security: 'Security'
    },
    infoSection: {
      title: 'Administrator data',
      subtitle: 'Update your contact details.',
      labels: {
        firstName: 'First Name',
        lastName: 'Last Name',
        email: 'Email address',
        documentType: 'Document Type',
        documentNumber: 'Document Number',
        phone: 'Phone / Mobile'
      },
      hints: {
        emailImmutable: 'Email cannot be modified.',
        nameImmutable: 'Name is set during registration.'
      },
      placeholders: {
        docTypeSelect: 'Select',
        docNumber: '12345678',
        phone: '987654321'
      },
      errors: {
        phonePattern: 'Enter a 9-digit number.'
      },
      saveLabel: 'Save changes'
    },
    securitySection: {
      title: 'Change password',
      subtitle: 'Use a strong password with at least 8 characters.',
      labels: {
        currentPassword: 'Current password *',
        newPassword: 'New password *',
        confirmPassword: 'Confirm new password *'
      },
      placeholders: {
        currentPassword: 'Your current password',
        newPassword: 'Minimum 8 characters',
        confirmPassword: 'Repeat new password'
      },
      errors: {
        required: 'Required field',
        minlength: 'Minimum 8 characters',
        mismatch: 'Passwords do not match'
      },
      saveLabel: 'Update password'
    },
    alerts: {
      profileSuccess: 'Profile successfully updated',
      profileError: 'Error updating profile',
      passwordSuccess: 'Password successfully updated',
      passwordError: 'Error changing password',
      passwordErrorMsg: 'Verify your current password.'
    }
  },
  adminSettings: {
    title: 'Store Configuration',
    subtitle: 'Manage general and contact settings',
    generalSection: {
      title: 'Store Information',
      labels: {
        companyName: 'Company Name',
        taxId: 'Tax ID',
        address: 'Business Address',
        supportEmail: 'Support Email',
        supportPhone: 'Support Phone',
        logoUrl: 'Logo URL',
        freeShippingThreshold: 'Free Shipping Threshold',
        orderExpirationMinutes: 'Order Expiration Time (Minutes)'
      },
      saveLabel: 'Save settings'
    },
    alerts: {
      success: 'Configuration updated',
      error: 'Error updating configuration',
      loadError: 'Error loading store configuration.'
    }
  },
  shop: {
  }
};
