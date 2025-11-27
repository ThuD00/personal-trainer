export function getCustomers() {
  return fetch(import.meta.env.VITE_API_URL + '/customers')
    .then(response => {
      if (!response.ok)
        throw new Error("Error when fetching customers: " + response.statusText);
    return response.json();
  })
}

export function deleteCustomer(url: string) {
  return fetch(url, { method: "DELETE" }) 
    .then(response => {
      if (!response.ok)
        throw new Error("Error when deleting customer: " + response.statusText);
      response.json();
    })
}



