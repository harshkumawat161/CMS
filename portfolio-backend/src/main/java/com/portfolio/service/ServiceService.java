package com.portfolio.service;

import com.portfolio.dto.request.ServiceRequest;
import com.portfolio.dto.response.ServiceResponse;

import java.util.List;

public interface ServiceService {

    List<ServiceResponse> getPublicServices();

    List<ServiceResponse> getAllServices();

    ServiceResponse getServiceById(Long id);

    ServiceResponse createService(ServiceRequest request);

    ServiceResponse updateService(Long id, ServiceRequest request);

    void deleteService(Long id);
}
