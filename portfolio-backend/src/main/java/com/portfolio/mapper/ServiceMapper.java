package com.portfolio.mapper;

import com.portfolio.dto.request.ServiceRequest;
import com.portfolio.dto.response.ServiceResponse;
import com.portfolio.model.Service;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class ServiceMapper {

    public ServiceResponse toResponse(Service service) {
        if (service == null) {
            return null;
        }

        return ServiceResponse.builder()
                .id(service.getId())
                .title(service.getTitle())
                .description(service.getDescription())
                .icon(service.getIcon())
                .displayOrder(service.getDisplayOrder())
                .published(service.isPublished())
                .createdAt(service.getCreatedAt())
                .updatedAt(service.getUpdatedAt())
                .build();
    }

    public List<ServiceResponse> toResponseList(List<Service> services) {
        if (services == null || services.isEmpty()) {
            return Collections.emptyList();
        }

        return services.stream()
                .map(this::toResponse)
                .toList();
    }

    public Service toEntity(ServiceRequest request) {
        if (request == null) {
            return null;
        }

        return Service.builder()
                .title(request.getTitle().trim())
                .description(request.getDescription().trim())
                .icon(request.getIcon() != null ? request.getIcon().trim() : null)
                .displayOrder(request.getDisplayOrder() != null ? request.getDisplayOrder() : 0)
                .published(request.getPublished() == null || request.getPublished())
                .build();
    }

    public void updateEntityFromRequest(Service service, ServiceRequest request) {
        if (service == null || request == null) {
            return;
        }

        service.setTitle(request.getTitle().trim());
        service.setDescription(request.getDescription().trim());
        service.setIcon(request.getIcon() != null ? request.getIcon().trim() : null);
        if (request.getDisplayOrder() != null) {
            service.setDisplayOrder(request.getDisplayOrder());
        }
        if (request.getPublished() != null) {
            service.setPublished(request.getPublished());
        }
    }
}
