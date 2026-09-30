import { getDatabase, runMigrations } from './database';
import type { CreateSerieInput, Serie, SerieFilter, UpdateSerieInput } from '../types/serie';

export async function getSeries(filtro: SerieFilter): Promise<Serie[]> {
  await runMigrations();
  const db = await getDatabase();
  const where = filtro === 'assistindo' ? 'WHERE concluida = ?' : filtro === 'concluidas' ? 'WHERE concluida = ?' : '';
  const args = filtro === 'assistindo' ? [0] : filtro === 'concluidas' ? [1] : [];
  return db.getAllAsync<Serie>(`SELECT * FROM series ${where} ORDER BY createdAt DESC, id DESC`, args);
}

export async function getSerieById(id: number): Promise<Serie | null> {
  await runMigrations();
  const db = await getDatabase();
  return (await db.getFirstAsync<Serie>('SELECT * FROM series WHERE id = ?', id)) ?? null;
}

export async function createSerie(input: CreateSerieInput): Promise<Serie> {
  await runMigrations();
  const db = await getDatabase();
  const createdAt = new Date().toISOString();
  const result = await db.runAsync(
    'INSERT INTO series (titulo, plataforma, temporadas, nota, concluida, createdAt) VALUES (?, ?, ?, ?, ?, ?)',
    input.titulo.trim(), input.plataforma.trim(), input.temporadas, input.nota, 0, createdAt,
  );
  return { id: result.lastInsertRowId, ...input, titulo: input.titulo.trim(), plataforma: input.plataforma.trim(), concluida: 0, createdAt };
}

export async function updateSerie(id: number, input: UpdateSerieInput): Promise<void> {
  await runMigrations();
  const db = await getDatabase();
  await db.runAsync(
    'UPDATE series SET titulo = ?, plataforma = ?, temporadas = ?, nota = ? WHERE id = ?',
    input.titulo.trim(), input.plataforma.trim(), input.temporadas, input.nota, id,
  );
}

export async function toggleSerieConcluida(id: number): Promise<void> {
  await runMigrations();
  const db = await getDatabase();
  await db.runAsync('UPDATE series SET concluida = CASE concluida WHEN 0 THEN 1 ELSE 0 END WHERE id = ?', id);
}

export async function deleteSerie(id: number): Promise<void> {
  await runMigrations();
  const db = await getDatabase();
  await db.runAsync('DELETE FROM series WHERE id = ?', id);
}
