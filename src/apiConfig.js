export const API_BASE_URL = "https://residentapi.strata-global.com/api";

export const ENDPOINTS = {
  contractsByClient: "/get-contracts-by-client",
  ownerContractsByClient: "/get-owner-contracts-by-client",
  billHistory: "/bill-history", // ✅ POST
  approvedClient: "/get-approved-client",
  paymentHistory: "/payment-history",
  finalBillRequest: "/final-bill-request-get",
};

/* ------------------ GENERIC GET ------------------ */
const apiGet = async (endpoint, params = {}, options = {}) => {
  const url = new URL(API_BASE_URL + endpoint);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });

  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
};

/* ------------------ GENERIC POST ------------------ */
const apiPost = async (endpoint, body = {}, options = {}) => {
  const response = await fetch(API_BASE_URL + endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: JSON.stringify(body),
    ...options,
  });

  const data = await response.json();
  return { ok: response.ok, status: response.status, data };
};

/* ------------------ API FUNCTIONS ------------------ */

export async function getContractsByClient(clientId, clientTypeId, options = {}) {
  return apiGet(
    ENDPOINTS.contractsByClient,
    { clientId, clientTypeId },
    options
  );
}

export async function getOwnerContractsByClient(
  clientId,
  clientTypeId,
  options = {}
) {
  return apiGet(
    ENDPOINTS.ownerContractsByClient,
    { clientId, clientTypeId },
    options
  );
}

/* ✅ FIXED: bill-history MUST be POST */
export async function getBillHistory(
  {
    key,
    fromDate,
    toDate,
    byOffice = false,
    officeIds = "",
    clientIds,
  },
  options = {}
) {
  return apiPost(
    ENDPOINTS.billHistory,
    {
      key,                     // loginKey
      FromDate: fromDate,
      ToDate: toDate,
      Byoffice: byOffice,
      OfficeIds: officeIds,
      ClientIds: clientIds,
    },
    options
  );
}

export async function getApprovedClient(userId, options = {}) {
  return apiGet(
    ENDPOINTS.approvedClient,
    { userId },
    options
  );
}

export async function getFinalBillRequest(userId, officeId, options = {}) {
  return apiGet(
    ENDPOINTS.finalBillRequest,
    {
      userId,           // ✅ required
      officeid: officeId, // ✅ lowercase required
    },
    options
  );
}
