import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, getApps, cert } from 'firebase-admin/app'

const apps = getApps()

if (!apps.length) {
    initializeApp({
        credential: cert('./fpmi-intermediary-firebase-adminsdk-re8cp-1f6379b6ea.json')
    })
}

export default async (request, response) => {
    const db = getFirestore()
    const studentsSnap = await db.collection('students').get()
    const studentsData = studentsSnap.docs.map(doc => {
        return {
            uuid: doc.id,
            ... doc.data()
        }
    })
    return studentsData
}