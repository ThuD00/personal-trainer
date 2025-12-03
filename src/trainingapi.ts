import type { TrainingForm } from "./types";

export function getTrainings() {
  return fetch(import.meta.env.VITE_API_URL + '/trainings')
    .then(response => {
      if (!response.ok)
        throw new Error("Error when fetching trainings: " + response.statusText);
      return response.json();
  })
}

export function deleteTraining(url: string) {
  return fetch(url, { method: "DELETE" }) 
    .then(response => {
      if (!response.ok)
        throw new Error("Error when deleting training: " + response.statusText);
    
      response.json();
    })
}


export function saveTraining(newTraining: TrainingForm) {
  return fetch(import.meta.env.VITE_API_URL + "/trainings", { 
      method: "POST",
      headers: { "content-type":"application/json" },
      body: JSON.stringify(newTraining) 
    }) 
    .then(response => {
      if (!response.ok)
        throw new Error("Error when adding new training: " + response.statusText);
      response.json();
    })
}
