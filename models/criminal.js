import pool from '../database/db.js';

export const getAllCriminals = async () => {
  try {
    console.log('Executing getAllCriminals query...');
    const [rows] = await pool.query('SELECT * FROM criminals');
    console.log('Query result:', rows);
    return rows;
  } catch (error) {
    console.error('Error in getAllCriminals:', error);
    throw error;
  }
};

export const getCriminalById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM criminals WHERE id = ?', [id]);
  return rows[0];
};

export const searchCriminals = async (term) => {
  const searchTerm = `%${term}%`;
  const [rows] = await pool.query(
    `SELECT * FROM criminals 
     WHERE criminal_name LIKE ? 
     OR case_id LIKE ? 
     OR criminal_no LIKE ? 
     OR crime_type LIKE ?`,
    [searchTerm, searchTerm, searchTerm, searchTerm]
  );
  return rows;
};

export const createCriminal = async (criminalData) => {
  const [result] = await pool.query(
    `INSERT INTO criminals 
     (case_id, criminal_no, criminal_name, nickname, father_name, 
      crime_type, arrest_date, crime_date, gender, address, 
      age, most_wanted, occupation, birth_mark) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      criminalData.case_id,
      criminalData.criminal_no,
      criminalData.criminal_name,
      criminalData.nickname,
      criminalData.father_name,
      criminalData.crime_type,
      criminalData.arrest_date,
      criminalData.crime_date,
      criminalData.gender,
      criminalData.address,
      criminalData.age,
      criminalData.most_wanted,
      criminalData.occupation,
      criminalData.birth_mark
    ]
  );
  return { id: result.insertId, ...criminalData };
};

export const updateCriminal = async (id, criminalData) => {
  await pool.query(
    `UPDATE criminals 
     SET case_id = ?, criminal_no = ?, criminal_name = ?, nickname = ?, 
         father_name = ?, crime_type = ?, arrest_date = ?, crime_date = ?, 
         gender = ?, address = ?, age = ?, most_wanted = ?, 
         occupation = ?, birth_mark = ? 
     WHERE id = ?`,
    [
      criminalData.case_id,
      criminalData.criminal_no,
      criminalData.criminal_name,
      criminalData.nickname,
      criminalData.father_name,
      criminalData.crime_type,
      criminalData.arrest_date,
      criminalData.crime_date,
      criminalData.gender,
      criminalData.address,
      criminalData.age,
      criminalData.most_wanted,
      criminalData.occupation,
      criminalData.birth_mark,
      id
    ]
  );
  return { id, ...criminalData };
};

export const deleteCriminal = async (id) => {
  await pool.query('DELETE FROM criminals WHERE id = ?', [id]);
  return { id };
};
