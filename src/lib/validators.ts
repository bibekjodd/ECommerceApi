import z from 'zod';

export const isStringArray = (data: unknown): boolean => {
  const schema = z.array(z.string());
  try {
    schema.parse(data);
    return true;
  } catch (error) {
    return false;
  }
};

export const isNumberArray = (data: unknown): boolean => {
  const schema = z.array(z.number());
  try {
    schema.parse(data);
    return true;
  } catch {
    return false;
  }
};
