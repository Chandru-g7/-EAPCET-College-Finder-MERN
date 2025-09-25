import mongoose from "mongoose";

const cutoffSchema = new mongoose.Schema({
  OC_BOYS: Number,
  OC_GIRLS: Number,
  SC_BOYS: Number,
  SC_GIRLS: Number,
  ST_BOYS: Number,
  ST_GIRLS: Number,
  BCA_BOYS: Number,
  BCA_GIRLS: Number,
  BCB_BOYS: Number,
  BCB_GIRLS: Number,
  BCC_BOYS: Number,
  BCC_GIRLS: Number,
  BCD_BOYS: Number,
  BCD_GIRLS: Number,
  BCE_BOYS: Number,
  BCE_GIRLS: Number,
  OC_EWS_BOYS: Number,
  OC_EWS_GIRLS: Number,
});

const collegeSchema = new mongoose.Schema({
  SNO: Number,
  INSTCODE: String,
  COLLEGE: String,
  TYPE: String,
  REG: String,
  DIST: String,
  PLACE: String,
  COED: String,
  AFF: String,
  ESTD: Number,
  A_REG: String,
  branch_code: String,
  COLLFEE: Number,
  cutoffs: cutoffSchema,
});

const College = mongoose.model("College", collegeSchema);

export default College;
