'use client'

import { setClubDoc } from "@/data/firestore/clubs"
import { v4 } from "uuid";

export default function TestPage() {
  return <button onClick={async () => {
    await setClubDoc(v4(), {
      name: "Franconia High School",
      address: {
        addressLine1: "123 Main St",
        city: "Franconia",
        country: "USA",
        state: "VA",
        zipCode: 64192
      }
    });
    await setClubDoc(v4(), {
      name: "Phoenix School for Boys & Girls",
      address: {
        addressLine1: "123 Main St",
        city: "Phoenix",
        country: "USA",
        state: "AZ",
        zipCode: 64252
      }
    });
    await setClubDoc(v4(), {
      name: "Rutgers Middle School",
      address: {
        addressLine1: "123 Main St",
        city: "Trenton",
        country: "USA",
        state: "NJ",
        zipCode: 28963
      }
    })
  }}>generate clubs</button>
}