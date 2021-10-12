export const state = () => ({
    currentPage: 1,
    dialog: false,
    gorillas:[],
    loading: false,
    hasNextPage: false
});

const nextPageQuery = (ref, last,  { sortDirection, sortBy, itemsPerPage }) => { 
    return ref.orderBy(sortBy, sortDirection).startAfter(last ? last[sortBy]: null).limit(itemsPerPage + 1);
}

const previousPageQuery = (ref, first, { sortDirection, sortBy, itemsPerPage }) => { 
    return ref.orderBy(sortBy, sortDirection).endBefore(first[sortBy]).limitToLast(itemsPerPage);
}

export const mutations = {
    setGorillas(state, gorillas){
        state.gorillas = gorillas;
    },
    setDialog(state, dialog){
        state.dialog = dialog;
    },
    setLoading(state, loading){
        state.loading = loading;
    },
    setCurrentPage(state, currentPage){
        state.currentPage = currentPage;
    },
    setHasNextPage(state, hasNextPage){
        state.hasNextPage = hasNextPage;
    }
};
export const actions = {
    async loadGorillas({commit, state}, { sortBy = 'name', desc = false, page, itemsPerPage }){
        try {
            // Early exit if called with incomplete data
            if(!itemsPerPage){
                return
            }

            // Determines the direction to sort the information in Firebase
            const sortDirection = desc ? 'desc' : 'asc';
            const dbRef = await this.$fire.firestore.collection('gorillas');
            
            // Bring an additional item to determine if there is a page next to the retrieved one.
            let query = dbRef.orderBy(sortBy, sortDirection).limit(itemsPerPage + 1);
            // Page has changed when the store's page doesn't match the page passed to the function
            const pageChange = state.currentPage !== page;
            // If the page passed to the function is lesser than the currentPage in the store, we want to retrieve the previous page
            const retrievePreviousPage = state.currentPage > page;

            // If we are moving backwards, we have a nextPage
            let hasNextPage = retrievePreviousPage;

            if(pageChange){
                const pagingFunction = retrievePreviousPage ? previousPageQuery: nextPageQuery ;
                // Items of the previous page are relative to the first element 
                // in our items array, items for the next page are relative to the last
                const referenceItem = retrievePreviousPage ? state.gorillas[0]: state.gorillas[state.gorillas.length - 1];
                query = pagingFunction(dbRef, referenceItem, {sortDirection, sortBy, itemsPerPage});
            }

            const dbSnapshot = await query.get();
            const gorillaList = dbSnapshot.docs.map(doc => ({... doc.data(), id: doc.id}));
            
            hasNextPage = hasNextPage || dbSnapshot.docs.length > itemsPerPage;
            if(hasNextPage && !retrievePreviousPage){
                // Remove the additional item
                gorillaList.pop();
            }
            
            commit("setHasNextPage", hasNextPage);
            commit("setCurrentPage", page);
            commit("setGorillas", gorillaList);
        } catch (e) {
          return Promise.reject(e)
        }
    },
    async addGorilla(_conf, gorilla){
        try {
            await this.$fire.firestore.collection("gorillas").add(gorilla);
        } catch (e) {
          return Promise.reject(e)
        }
    },
    async removeGorilla(_conf, gorillaId){
        try {
            await this.$fire.firestore.collection("gorillas").doc(gorillaId).delete();
        } catch (e) {
          return Promise.reject(e)
        }
    }
};
export const getters = {
    gorillas: state => state.gorillas,
    dialog: state => state.dialog,
    loading: state => state.loading,
    currentPage: state => state.currentPage,
    hasNextPage: state => state.hasNextPage
};

