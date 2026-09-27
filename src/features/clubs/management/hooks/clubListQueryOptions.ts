import { listClubDocs } from "@/data/firestore/clubs";
import { FirestoreQueryOptions, ListDocsResponse } from "@/data/firestore/firestoreClientOperations";
import { Club, ClubDoc } from "@/types/club-types";
import { infiniteQueryOptions, InfiniteData } from "@tanstack/react-query";
import { DocumentData, DocumentSnapshot } from "firebase/firestore";

export default function clubListQueryOptions(firestoreQueryOptions: FirestoreQueryOptions<ClubDoc> = {}) {
  return infiniteQueryOptions({
    queryKey: ['clubs', 'list', firestoreQueryOptions],
    queryFn: async ({ pageParam, client }) => {
      const updatedQueryOptions = firestoreQueryOptions ? { ...firestoreQueryOptions } : {};
      const limit = updatedQueryOptions.limit ? updatedQueryOptions.limit : updatedQueryOptions.limitToLast ? updatedQueryOptions.limitToLast : undefined;
      if (pageParam) {
        if (pageParam.direction === "next") {
          updatedQueryOptions.startAfter = pageParam.snapshot;
          updatedQueryOptions.startAt = undefined;
          if (limit) {
            updatedQueryOptions.limit = limit;
            updatedQueryOptions.limitToLast = undefined;
          }
        } else {
          updatedQueryOptions.endBefore = pageParam.snapshot;
          updatedQueryOptions.endAt = undefined;
          if (limit) {
            updatedQueryOptions.limit = undefined;
            updatedQueryOptions.limitToLast = limit;
          }
        }
      }
      const clubsPage = await listClubDocs(updatedQueryOptions);
      clubsPage.docs.forEach((club: Club) => client.setQueryData(['clubs', 'detail', club.clubId], club));
      clubsPage.snapshots.forEach((snapshot) => client.setQueryData(['clubs', 'detail', snapshot.id, 'snapshot'], snapshot));
      return clubsPage;
    },
    initialPageParam: undefined as FirestoreInfiniteQueryPageParam<ClubDoc> | undefined,
    getPreviousPageParam: (firstPage) => firstPage.snapshots.length > 0 ? { direction: 'prev' as const, snapshot: firstPage.snapshots[0] } : undefined,
    getNextPageParam: (lastPage) => lastPage.snapshots.length > 0 ? { direction: 'next' as const, snapshot: lastPage.snapshots[lastPage.snapshots.length - 1] } : undefined,
    select: flattenFirestoreInfiniteData
  })
}

function flattenFirestoreInfiniteData<DbModelType extends DocumentData, AppModelType = DbModelType>(data: InfiniteData<ListDocsResponse<DbModelType, AppModelType>>) {
  return data.pages.flatMap(page => page.docs);
}

type FirestoreInfiniteQueryPageParam<DbModelType extends DocumentData, AppModelType = DbModelType> = {
  direction: 'prev' | 'next';
  snapshot: DocumentSnapshot<AppModelType, DbModelType>;
}