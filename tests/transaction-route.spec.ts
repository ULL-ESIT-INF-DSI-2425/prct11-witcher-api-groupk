import { beforeAll, describe, test } from "vitest";
import request from 'supertest';
import { app } from "../src/routes/main-app.js";
import { Transaction } from "../src/transactions/transaction.js";

beforeAll(async () => {
    await Transaction.deleteMany({ name: 'Prueba' });
});

describe('/transactions', () => {
    describe('POST /transactions', () => {
        
    });

    describe('GET /transactions', () => {
        
    });

    describe('PATCH /transactions', () => {
        
    });

    describe('DELETE /transactions', () => {
        
    });
});