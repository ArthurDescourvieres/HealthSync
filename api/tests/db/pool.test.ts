import { describe, it, expect } from 'vitest'
import { pool } from '../../src/db/pool.js'

describe('pool Postgres', () => {
      it('Se connecte à la base et répond à une requête', async () => {
            const resultat = await pool.query('SELECT 1 AS valeur')
        
            expect(resultat.rows[0]).toEqual({ valeur: 1 })
      })

})