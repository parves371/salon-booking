import { Box, Heading, FormControl, FormLabel, Input, Button, Select, Stack, useToast } from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function Add() {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [newService, setNewService] = useState({
    categoryId: '',
    name: '',
    time: '',
    price: '',
    option: false,
  });
  const [newOption, setNewOption] = useState({
    serviceId: '',
    name: '',
    time: '',
    price: '',
  });
  const toast = useToast();

  useEffect(() => {
    async function fetchCategories() {
      const response = await fetch('/api/categories');
      const result = await response.json();
      setCategories(result);
    }
    fetchCategories();
  }, []);

  useEffect(() => {
    async function fetchServices() {
      const response = await fetch('/api/services');
      const result = await response.json();
      setServices(result);
    }
    fetchServices();
  }, []);

  async function handleAddCategory() {
    const response = await fetch('/api/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newCategory }),
    });
    if (response.ok) {
      toast({ title: 'Category added successfully', status: 'success' });
      setNewCategory('');
    }
  }
  

  async function handleAddService() {
    const response = await fetch('/api/services', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newService),
    });
    if (response.ok) {
      toast({ title: 'Service added successfully', status: 'success' });
      setNewService({ categoryId: '', name: '', time: '', price: '', option: false });
    }
  }

  async function handleAddOption() {
    const response = await fetch('/api/options', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newOption),
    });
    if (response.ok) {
      toast({ title: 'Option added successfully', status: 'success' });
      setNewOption({ serviceId: '', name: '', time: '', price: '' });
    }
  }

  return (
    <Box maxWidth="600px" mx="auto" mt={10}>
      <Heading mb={5}>Add Data</Heading>

      {/* Add Category */}
      <Stack spacing={4} mb={6}>
        <Heading size="md">Add Category</Heading>
        <FormControl>
          <FormLabel>Category Name</FormLabel>
          <Input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
        </FormControl>
        <Button colorScheme="blue" onClick={handleAddCategory}>
          Add Category
        </Button>
      </Stack>

      {/* Add Service */}
      <Stack spacing={4} mb={6}>
        <Heading size="md">Add Service</Heading>
        <FormControl>
          <FormLabel>Category</FormLabel>
          <Select
            placeholder="Select Category"
            value={newService.categoryId}
            onChange={(e) => setNewService({ ...newService, categoryId: e.target.value })}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Service Name</FormLabel>
          <Input
            value={newService.name}
            onChange={(e) => setNewService({ ...newService, name: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Time</FormLabel>
          <Input
            value={newService.time}
            onChange={(e) => setNewService({ ...newService, time: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            value={newService.price}
            onChange={(e) => setNewService({ ...newService, price: e.target.value })}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleAddService}>
          Add Service
        </Button>
      </Stack>

      {/* Add Option */}
      <Stack spacing={4}>
        <Heading size="md">Add Option</Heading>
        <FormControl>
          <FormLabel>Service</FormLabel>
          <Select
            placeholder="Select Service"
            value={newOption.serviceId}
            onChange={(e) => setNewOption({ ...newOption, serviceId: e.target.value })}
          >
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Option Name</FormLabel>
          <Input
            value={newOption.name}
            onChange={(e) => setNewOption({ ...newOption, name: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Time</FormLabel>
          <Input
            value={newOption.time}
            onChange={(e) => setNewOption({ ...newOption, time: e.target.value })}
          />
        </FormControl>
        <FormControl>
          <FormLabel>Price</FormLabel>
          <Input
            type="number"
            value={newOption.price}
            onChange={(e) => setNewOption({ ...newOption, price: e.target.value })}
          />
        </FormControl>
        <Button colorScheme="blue" onClick={handleAddOption}>
          Add Option
        </Button>
      </Stack>
    </Box>
  );
}
