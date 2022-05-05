// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  ticketStatus: {
    open: 'open',
    closed: 'closed'
  },

  roles: {
    admin: 'Admin',
    supporter: 'Supporter',
    customer:'Customer'
  },
  endpoints: {
    "auth": {
      "registerCustomer": "https://localhost:44388/api/auth/customer-register",
      "preRegisterEmployee": "https://localhost:44388/api/auth/employee-preregister",
      "registerEmployee": "https://localhost:44388/api/auth/employee-register",
      "login": "https://localhost:44388/api/auth/login",
      "logout": "https://localhost:44388/api/auth/logout",
      "resendEmailConfirmation": "https://localhost:44388/api/auth/reconfirm-email",
      "forgotPassword": "https://localhost:44388/api/auth/forgot-password",
      "resetPassword": "https://localhost:44388/api/auth/reset-password",
      "refreshRegistrationToke": "https://localhost:44388/api/auth/refresh-registration-token",
      "validateRegistrationToken": "https://localhost:44388/api/auth/validate-registration-token"
    },
    "customers": {
      "getById": "https://localhost:44388/api/customers/",
      "put": "https://localhost:44388/api/customers/put/",
    },
    "employees": {
      "getAllSupporters": "https://localhost:44388/api/employees/get-supporters",
      "searchUsers": "https://localhost:44388/api/employees/search-users",
      "getEmployeeById": "https://localhost:44388/api/employees/get-by-id",    
      "editSupporter": "https://localhost:44388/api/employees/edit-supporter",
      "getTopClosingTicketsStats": "https://localhost:44388/api/employees/get-top-closing-tickets-stats",
      "getGeneralMontlyStats": "https://localhost:44388/api/employees/get-general-monthly-stats"
    },
    "tickets": {
      "getAll": "https://localhost:44388/api/tickets/get-all",
      "getOpenTickets": "https://localhost:44388/api/tickets/get-open-tickets",
      "getAllByUserId": "https://localhost:44388/api/tickets/get-all-by-user-id",
      "getOpenTicketsByUserId": "https://localhost:44388/api/tickets/get-open-tickets-by-user-id",
      "close": "https://localhost:44388/api/tickets/close",
      "addReply": "https://localhost:44388/api/tickets/add-reply",
      "create": "https://localhost:44388/api/tickets/create",
      "getCategories": "https://localhost:44388/api/tickets/get-categories",
      "typeAheadSearch": "https://localhost:44388/api/tickets/type-ahead-search",
      "seedTickets": "https://localhost:44388/api/seed/tickets",
    },
    "logs": {
      "getErrorLogs": "https://localhost:44388/api/logs/error-logs",
      "getAuthLogs": "https://localhost:44388/api/logs/auth-logs"
    }
  },
  localStorage: {
    "userKey":"_uk"
  },
  registerType: {
    customer: 'customer',
    employeeRegister: 'employeeRegister',
    employeePreRegister:'employeePreRegister'
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
