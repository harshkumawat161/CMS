package com.portfolio.service.impl;

import com.portfolio.dto.request.ServiceRequest;
import com.portfolio.dto.response.ServiceResponse;
import com.portfolio.exception.ResourceNotFoundException;
import com.portfolio.mapper.ServiceMapper;
import com.portfolio.model.Service;
import com.portfolio.repository.ServiceRepository;
import com.portfolio.service.ServiceService;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@org.springframework.stereotype.Service
public class ServiceServiceImpl implements ServiceService {

    private final ServiceRepository serviceRepository;
    private final ServiceMapper serviceMapper;

    public ServiceServiceImpl(ServiceRepository serviceRepository, ServiceMapper serviceMapper) {
        this.serviceRepository = serviceRepository;
        this.serviceMapper = serviceMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> getPublicServices() {
        List<Service> services = serviceRepository.findByPublishedTrueOrderByDisplayOrderAscIdAsc();
        return serviceMapper.toResponseList(services);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ServiceResponse> getAllServices() {
        List<Service> services = serviceRepository.findAllByOrderByDisplayOrderAscIdAsc();
        return serviceMapper.toResponseList(services);
    }

    @Override
    @Transactional(readOnly = true)
    public ServiceResponse getServiceById(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));
        return serviceMapper.toResponse(service);
    }

    @Override
    @Transactional
    public ServiceResponse createService(ServiceRequest request) {
        Service service = serviceMapper.toEntity(request);
        Service saved = serviceRepository.save(service);
        return serviceMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public ServiceResponse updateService(Long id, ServiceRequest request) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));

        serviceMapper.updateEntityFromRequest(service, request);
        Service updated = serviceRepository.save(service);
        return serviceMapper.toResponse(updated);
    }

    @Override
    @Transactional
    public void deleteService(Long id) {
        Service service = serviceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Service", "id", id));
        serviceRepository.delete(service);
    }
}
