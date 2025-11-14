import { Injectable } from '@angular/core';
import { initializeApp, FirebaseApp, FirebaseOptions } from 'firebase/app';
import { 
    getFirestore, 
    collection, 
    getDocs, 
    doc, 
    getDoc, 
    Firestore,
    query,
    where,
    addDoc 
} from 'firebase/firestore';
import { 
    getAuth, 
    signInAnonymously, 
    signInWithCustomToken, 
    Auth 
} from 'firebase/auth';
import { Personaje } from '../componentes/interfaces/interfaces';
import { Observable, from, map, BehaviorSubject, switchMap, throwError } from 'rxjs';


declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string;


const FALLBACK_FIREBASE_CONFIG: FirebaseOptions = {
    
    apiKey: "AIzaSyBt93f73IGtqE4xsYXoqdbaylqmvpkBsq0", 
    authDomain: "integradora-f466f.firebaseapp.com",
    projectId: "integradora-f466f",
    storageBucket: "integradora-f466f.firebasestorage.app",
    messagingSenderId: "24324410435",
    appId: "1:24324410435:web:82a155286d0a9f2f1b58f6",
    measurementId: "G-2BS5CY5QHQ"
};

@Injectable({
    providedIn: 'root'
})
export class PersonajesService {
    
    private db!: Firestore;
    private auth!: Auth;
    private readonly COLLECTION_NAME = 'personajes';
    private readonly appId: string; 
    
    private isReadySubject = new BehaviorSubject<boolean>(false);
    public isReady$ = this.isReadySubject.asObservable();

    constructor() {
        this.appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        this._initializeFirebase(); 
    }

    private _initializeFirebase() {
        if (this.isReadySubject.value) {
            return;
        }
        
        let firebaseConfig: FirebaseOptions;
        const globalConfigString = typeof __firebase_config !== 'undefined' ? __firebase_config : '{}';
        let globalConfig;
        
        try {
            globalConfig = JSON.parse(globalConfigString);
        } catch {
            globalConfig = {};
        }

        if (Object.keys(globalConfig).length === 0 || !globalConfig.apiKey) {
            console.warn("[Firebase] Usando configuración de respaldo. La inyección de __firebase_config falló.");
            firebaseConfig = FALLBACK_FIREBASE_CONFIG; 
        } else {
            firebaseConfig = globalConfig;
        }

        let app: FirebaseApp;
        try {
            app = initializeApp(firebaseConfig);
            this.db = getFirestore(app);
            this.auth = getAuth(app);
            
            this._signIn().then(() => {
                this.isReadySubject.next(true); 
                console.log(`[Servicio] Firebase inicializado y autenticado con éxito.`);
            }).catch(error => {
                console.error("[Servicio] Fallo grave de autenticación/inicialización:", error);
                this.isReadySubject.next(false);
            });

        } catch (error) {
            console.error("[Servicio] Error al inicializar la app o ya estaba inicializada:", error);
            this.isReadySubject.next(false);
        }
    }

    private async _signIn(): Promise<void> {
        const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

        try {
            if (initialAuthToken) {
                await signInWithCustomToken(this.auth, initialAuthToken);
            } else {
                await signInAnonymously(this.auth);
            }
        } catch (error) {
            console.error("[Servicio] Error en el proceso de autenticación:", error);
            throw error; 
        }
    }
    
    
    private getCollectionPath() {
        if (!this.db) {
            throw new Error("El servicio de Firebase no está inicializado.");
        }
        return this.COLLECTION_NAME; // Devuelve 'personajes'
    }

    // Método de obtención de datos para la lista principal (sin filtro)
    getDatos(): Observable<Personaje[]> {
        return this.isReady$.pipe(
            switchMap(isReady => {
                if (!isReady) {
                    return throwError(() => new Error("La base de datos no está lista para ser consultada."));
                }
                
                const personajesCollection = collection(this.db, this.getCollectionPath());
                
                return from(getDocs(personajesCollection)).pipe(
                    map(snapshot => {
                        const personajes: Personaje[] = [];
                        snapshot.forEach((doc: any) => {
                            personajes.push({
                                id: doc.id,
                                ...(doc.data() as Omit<Personaje, 'id'>)
                            });
                        });
                        return personajes;
                    })
                );
            })
        );
    }
    
    // Obtener personajes filtrados por Raza
    getPersonajesPorRaza(raza: string): Observable<Personaje[]> {
        return this.isReady$.pipe(
            switchMap(isReady => {
                if (!isReady) {
                    return throwError(() => new Error("La base de datos no está lista para ser consultada."));
                }

                const collectionRef = collection(this.db, this.getCollectionPath());
                const q = query(collectionRef, where('raza', '==', raza));

                return from(getDocs(q)).pipe(
                    map(snapshot => {
                        const personajes: Personaje[] = [];
                        snapshot.forEach((doc: any) => {
                            personajes.push({
                                id: doc.id,
                                ...(doc.data() as Omit<Personaje, 'id'>)
                            });
                        });
                        console.log(`[Servicio] Personajes de raza '${raza}' cargados.`);
                        return personajes;
                    })
                );
            })
        );
    }
    
    // Método para obtener un personaje por ID
    getDetalle(id: string): Observable<{ data: Personaje }> {
        return this.isReady$.pipe(
            switchMap(isReady => {
                if (!isReady) {
                    return throwError(() => new Error("La base de datos no está lista para ser consultada."));
                }
                
                const docRef = doc(this.db, this.getCollectionPath(), id);
                
                return from(getDoc(docRef)).pipe(
                    map(docSnap => {
                        if (docSnap.exists()) {
                            return { data: { id: docSnap.id, ...(docSnap.data() as Omit<Personaje, 'id'>) } };
                        } else {
                            throw new Error(`Personaje con ID ${id} no encontrado.`);
                        }
                    })
                );
            })
        );
    }

    // Método de siembra de datos corregido
    async sembrarDatos(data: Omit<Personaje, 'id'>) {
        if (!this.db) {
            throw new Error("El servicio de Firebase no está inicializado.");
        }
        
        const collectionRef = collection(this.db, this.getCollectionPath());
        
        try {
            await addDoc(collectionRef, data);
            console.log(`[Servicio] Dato sembrado con éxito.`);
        } catch (e: any) { 
            console.error("Error al sembrar datos:", e);
            throw e;
        }
    }
}