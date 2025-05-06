import { beforeAll, describe, test } from "vitest";
import request from 'supertest';
import { app } from "../src/routes/main-app.js";
import { Merchant } from "../src/characters/merchant.js";

beforeAll(async () => {
    await Merchant.deleteMany();
});