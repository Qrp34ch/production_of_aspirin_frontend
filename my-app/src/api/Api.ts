/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface DsReaction {
  densityRM?: number;
  densitySM?: number;
  details?: string;
  id?: number;
  isDelete?: boolean;
  /** VolumeRM         float32 */
  molarMassRM?: number;
  /** VolumeSM         float32 */
  molarMassSM?: number;
  resultMaterial?: string;
  src?: string;
  srcUr?: string;
  startingMaterial?: string;
  title?: string;
}

export interface DsUsers {
  fio?: string;
  id?: number;
  is_moderator?: boolean;
  login?: string;
}

export interface HandlerCompleteOrRejectRequest {
  new_status: boolean;
}

export interface HandlerInputPurity {
  purity: number;
}

export interface HandlerLoginReq {
  login?: string;
  password?: string;
}

export interface HandlerLoginResp {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: HandlerUserInfo;
}

export interface HandlerReactionInput {
  density_rm?: number;
  density_sm?: number;
  /**
   * Src              string  json:"src,omitempty"
   * SrcUr            string  json:"src_ur,omitempty"
   */
  details?: string;
  is_delete?: boolean;
  molar_mass_rm?: number;
  molar_mass_sm?: number;
  result_material?: string;
  starting_material?: string;
  title?: string;
  volume_rm?: number;
  volume_sm?: number;
}

export interface HandlerRegisterReq {
  fio?: string;
  /** лучше назвать то же самое что login */
  login?: string;
  pass?: string;
}

export interface HandlerRegisterResp {
  ok?: boolean;
}

export interface HandlerSuccessResponse {
  data?: any;
  message?: string;
  status?: string;
}

export interface HandlerUpdateReactionInSynthesisRequest {
  reaction_id: number;
  volume_sm: number;
}

export interface HandlerUpdateUserRequest {
  login?: string;
  name?: string;
  password?: string;
}

export interface HandlerUserInfo {
  /** @example "Иванов Иван Иванович" */
  fio?: string;
  /** @example 1 */
  id?: number;
  /** @example true */
  is_moderator?: boolean;
  /** @example "admin" */
  login?: string;
}

import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  HeadersDefaults,
  ResponseType,
} from "axios";
import axios from "axios";

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams
  extends Omit<AxiosRequestConfig, "data" | "params" | "url" | "responseType"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
}

export type RequestParams = Omit<
  FullRequestParams,
  "body" | "method" | "query" | "path"
>;

export interface ApiConfig<SecurityDataType = unknown>
  extends Omit<AxiosRequestConfig, "data" | "cancelToken"> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
}

export enum ContentType {
  Json = "application/json",
  JsonApi = "application/vnd.api+json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private secure?: boolean;
  private format?: ResponseType;

  constructor({
    securityWorker,
    secure,
    format,
    ...axiosConfig
  }: ApiConfig<SecurityDataType> = {}) {
    this.instance = axios.create({
      ...axiosConfig,
      baseURL: axiosConfig.baseURL || "",
    });
    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected mergeRequestParams(
    params1: AxiosRequestConfig,
    params2?: AxiosRequestConfig,
  ): AxiosRequestConfig {
    const method = params1.method || (params2 && params2.method);

    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...((method &&
          this.instance.defaults.headers[
            method.toLowerCase() as keyof HeadersDefaults
          ]) ||
          {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected stringifyFormItem(formItem: unknown) {
    if (typeof formItem === "object" && formItem !== null) {
      return JSON.stringify(formItem);
    } else {
      return `${formItem}`;
    }
  }

  protected createFormData(input: Record<string, unknown>): FormData {
    if (input instanceof FormData) {
      return input;
    }
    return Object.keys(input || {}).reduce((formData, key) => {
      const property = input[key];
      const propertyContent: any[] =
        property instanceof Array ? property : [property];

      for (const formItem of propertyContent) {
        const isFileType = formItem instanceof Blob || formItem instanceof File;
        formData.append(
          key,
          isFileType ? formItem : this.stringifyFormItem(formItem),
        );
      }

      return formData;
    }, new FormData());
  }

  public request = async <T = any, _E = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<AxiosResponse<T>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || undefined;

    if (
      type === ContentType.FormData &&
      body &&
      body !== null &&
      typeof body === "object"
    ) {
      body = this.createFormData(body as Record<string, unknown>);
    }

    if (
      type === ContentType.Text &&
      body &&
      body !== null &&
      typeof body !== "string"
    ) {
      body = JSON.stringify(body);
    }

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type ? { "Content-Type": type } : {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}

/**
 * @title ASPIRIN
 * @version 1.0
 * @license AS IS (NO WARRANTY)
 * @contact API Support <address> (https://github.com/Qrp34ch/RIP)
 *
 * Aspirin
 */
export class Api<
  SecurityDataType extends unknown,
> extends HttpClient<SecurityDataType> {
  api = {
    /**
     * @description Create a new chemical reaction
     *
     * @tags Reactions
     * @name CreateReactionCreate
     * @summary Create new reaction
     * @request POST:/API/create-reaction
     */
    createReactionCreate: (
      input: HandlerReactionInput,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          description?: string;
          status?: string;
        },
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/create-reaction`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get all reactions or search by title
     *
     * @tags Reactions
     * @name ReactionList
     * @summary Get list of reactions
     * @request GET:/API/reaction
     */
    reactionList: (
      query?: {
        /** Search query */
        query?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        {
          query?: string;
          reactions?: DsReaction[];
        },
        any
      >({
        path: `/API/reaction`,
        method: "GET",
        query: query,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update reaction volume in current user's synthesis
     *
     * @tags Synthesis-Reactions
     * @name ReactionSynthesisUpdate
     * @summary Update reaction in synthesis
     * @request PUT:/API/reaction-synthesis
     * @secure
     */
    reactionSynthesisUpdate: (
      input: HandlerUpdateReactionInSynthesisRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        HandlerSuccessResponse,
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/reaction-synthesis`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Remove reaction from current user's synthesis
     *
     * @tags Synthesis-Reactions
     * @name ReactionSynthesisDelete
     * @summary Remove reaction from synthesis
     * @request DELETE:/API/reaction-synthesis
     * @secure
     */
    reactionSynthesisDelete: (
      query: {
        /** Reaction ID */
        reaction_id: number;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        HandlerSuccessResponse,
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/reaction-synthesis`,
        method: "DELETE",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get specific reaction details
     *
     * @tags Reactions
     * @name ReactionDetail
     * @summary Get reaction by ID
     * @request GET:/API/reaction/{id}
     */
    reactionDetail: (id: number, params: RequestParams = {}) =>
      this.request<
        {
          reaction?: DsReaction;
        },
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/reaction/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update existing reaction
     *
     * @tags Reactions
     * @name ReactionUpdate
     * @summary Update reaction
     * @request PUT:/API/reaction/{id}
     */
    reactionUpdate: (
      id: number,
      input: HandlerReactionInput,
      params: RequestParams = {},
    ) =>
      this.request<
        HandlerSuccessResponse,
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/reaction/${id}`,
        method: "PUT",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete reaction by ID (soft delete)
     *
     * @tags Reactions
     * @name ReactionDelete
     * @summary Delete reaction
     * @request DELETE:/API/reaction/{id}
     */
    reactionDelete: (id: number, params: RequestParams = {}) =>
      this.request<
        HandlerSuccessResponse,
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/reaction/${id}`,
        method: "DELETE",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Add reaction to current user's synthesis
     *
     * @tags Reactions
     * @name ReactionAddReactionInSynthesisCreate
     * @summary Add reaction to synthesis
     * @request POST:/API/reaction/{id}/add-reaction-in-synthesis
     * @secure
     */
    reactionAddReactionInSynthesisCreate: (
      id: number,
      params: RequestParams = {},
    ) =>
      this.request<
        HandlerSuccessResponse,
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/reaction/${id}/add-reaction-in-synthesis`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Upload image for reaction
     *
     * @tags Reactions
     * @name ReactionImageCreate
     * @summary Upload reaction image
     * @request POST:/API/reaction/{id}/image
     */
    reactionImageCreate: (
      id: number,
      data: {
        /** Image file */
        image: File;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        HandlerSuccessResponse,
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/reaction/${id}/image`,
        method: "POST",
        body: data,
        type: ContentType.FormData,
        format: "json",
        ...params,
      }),

    /**
     * @description Get syntheses with optional filtering
     *
     * @tags Syntheses
     * @name SynthesisList
     * @summary Get list of syntheses
     * @request GET:/API/synthesis
     * @secure
     */
    synthesisList: (
      query?: {
        /** Status filter */
        status?: string;
        /** Start date (YYYY-MM-DD) */
        start_date?: string;
        /** End date (YYYY-MM-DD) */
        end_date?: string;
      },
      params: RequestParams = {},
    ) =>
      this.request<
        HandlerSuccessResponse,
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/synthesis`,
        method: "GET",
        query: query,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Delete current user's active synthesis
     *
     * @tags Syntheses
     * @name SynthesisDelete
     * @summary Delete current user's synthesis
     * @request DELETE:/API/synthesis
     * @secure
     */
    synthesisDelete: (params: RequestParams = {}) =>
      this.request<
        HandlerSuccessResponse,
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/synthesis`,
        method: "DELETE",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get current user's synthesis ID and items count
     *
     * @tags Syntheses
     * @name SynthesisIconList
     * @summary Get synthesis icon data
     * @request GET:/API/synthesis/icon
     * @secure
     */
    synthesisIconList: (params: RequestParams = {}) =>
      this.request<HandlerSuccessResponse, any>({
        path: `/API/synthesis/icon`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get detailed information about synthesis
     *
     * @tags Syntheses
     * @name SynthesisDetail
     * @summary Get synthesis by ID
     * @request GET:/API/synthesis/{id}
     */
    synthesisDetail: (id: number, params: RequestParams = {}) =>
      this.request<
        {
          data?: object;
          status?: string;
        },
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/synthesis/${id}`,
        method: "GET",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update purity percentage for synthesis
     *
     * @tags Syntheses
     * @name SynthesisUpdate
     * @summary Update synthesis purity
     * @request PUT:/API/synthesis/{id}
     */
    synthesisUpdate: (
      id: number,
      input: HandlerInputPurity,
      params: RequestParams = {},
    ) =>
      this.request<
        HandlerSuccessResponse,
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/synthesis/${id}`,
        method: "PUT",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Change synthesis status to "сформирован"
     *
     * @tags Syntheses
     * @name SynthesisFormUpdate
     * @summary Form synthesis
     * @request PUT:/API/synthesis/{id}/form
     */
    synthesisFormUpdate: (id: number, params: RequestParams = {}) =>
      this.request<
        {
          data?: object;
          message?: string;
          reactions?: DsReaction[];
          status?: string;
        },
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/synthesis/${id}/form`,
        method: "PUT",
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Complete or reject synthesis by moderator
     *
     * @tags Syntheses
     * @name SynthesisModerateUpdate
     * @summary Complete or reject synthesis
     * @request PUT:/API/synthesis/{id}/moderate
     */
    synthesisModerateUpdate: (
      id: number,
      input: HandlerCompleteOrRejectRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        {
          data?: object;
          message?: string;
          reactions?: DsReaction[];
          status?: string;
        },
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/synthesis/${id}/moderate`,
        method: "PUT",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Authenticate user and return JWT token
     *
     * @tags Users
     * @name UsersLoginCreate
     * @summary User login
     * @request POST:/API/users/login
     */
    usersLoginCreate: (input: HandlerLoginReq, params: RequestParams = {}) =>
      this.request<
        HandlerLoginResp,
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/users/login`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Logout user and invalidate token
     *
     * @tags Users
     * @name UsersLogoutCreate
     * @summary User logout
     * @request POST:/API/users/logout
     * @secure
     */
    usersLogoutCreate: (params: RequestParams = {}) =>
      this.request<
        {
          message?: string;
        },
        any
      >({
        path: `/API/users/logout`,
        method: "POST",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Get current user's profile information
     *
     * @tags Users
     * @name UsersProfileList
     * @summary Get user profile
     * @request GET:/API/users/profile
     * @secure
     */
    usersProfileList: (params: RequestParams = {}) =>
      this.request<
        {
          data?: DsUsers;
          status?: string;
        },
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/users/profile`,
        method: "GET",
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Update current user's profile information
     *
     * @tags Users
     * @name UsersProfileUpdate
     * @summary Update user profile
     * @request PUT:/API/users/profile
     * @secure
     */
    usersProfileUpdate: (
      input: HandlerUpdateUserRequest,
      params: RequestParams = {},
    ) =>
      this.request<
        HandlerSuccessResponse,
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/users/profile`,
        method: "PUT",
        body: input,
        secure: true,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * @description Register new user in the system
     *
     * @tags Users
     * @name UsersRegisterCreate
     * @summary Register new user
     * @request POST:/API/users/register
     */
    usersRegisterCreate: (
      input: HandlerRegisterReq,
      params: RequestParams = {},
    ) =>
      this.request<
        HandlerRegisterResp,
        {
          description?: string;
          status?: string;
        }
      >({
        path: `/API/users/register`,
        method: "POST",
        body: input,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
