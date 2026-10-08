package com.portfolio.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateMessageStatusRequest {

    @Builder.Default
    @io.swagger.v3.oas.annotations.media.Schema(description = "Flag indicating read (true) or unread (false) status", example = "true")
    private Boolean read = true;
}
