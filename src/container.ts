import 'reflect-metadata';
import { Container } from 'inversify';

// Create and configure the container
const container = new Container();

// The AutoRegister decorator will handle all registrations automatically
// No need for manual registrations here

export { container }; 